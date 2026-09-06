/**
 * Twenty CRM adapter (REST API).
 *
 * A landing lead becomes two records, upserted by email:
 *   1. Person      — created, or updated when the email already exists
 *   2. Opportunity — created, or updated when the person already has one for
 *                    this edition, linked via pointOfContactId
 *
 * The caller always gets the same result whether the lead was new or returning:
 * telling a visitor "you are already in our system" leaks who is registered.
 *
 * Twenty uses composite field types, so flat strings are rejected: a name is
 * { firstName, lastName }, an email is { primaryEmail }, a phone carries its
 * calling code separately, and money is expressed in micros.
 *
 * Docs: https://twenty.com/developers/rest-api
 */
import { logger } from "@/utils/logger.ts"

export interface TwentyConfig {
	/** Base URL of the Twenty API, e.g. https://crm.femmtribu.es (no trailing slash). */
	baseUrl: string
	/** API key from Twenty → Settings → APIs. Sent as a Bearer token. */
	apiToken: string
}

export interface LeadInput {
	name: string
	email: string | null
	phone: string | null
	/** Due date, ISO YYYY-MM-DD. Health data — never forwarded to ad platforms. */
	fpp: string
	edition: string
	source: string
	/** Fed from utm_campaign, or the landing's fallback campaign. */
	campaign: string | null
	utmSource: string | null
	utmMedium: string | null
	utmContent: string | null
	utmTerm: string | null
	fbclid: string | null
	landingPath: string | null
	referrer: string | null
}

/**
 * Opportunity custom fields: our key → the field's API name in Twenty.
 *
 * Twenty derives the API name from the field label when you create it, and you
 * can edit it under Settings → Data model → Opportunity. The right-hand values
 * below must match those API names exactly, or Twenty rejects the payload.
 * Renaming a field in Twenty is a one-line change here.
 *
 * Delete a line to stop sending that field.
 */
const OPPORTUNITY_CUSTOM_FIELDS = {
	fpp: "fpp",
	campaign: "campaign",
	utmSource: "utmSource",
	utmMedium: "utmMedium",
	utmContent: "utmContent",
	utmTerm: "utmTerm",
	fbclid: "fbclid",
	landingPath: "landingPath",
	referrer: "referrer",
	edition: "edition",
	source: "source",
} as const satisfies Partial<Record<keyof LeadInput, string>>

export interface TwentyResult {
	personId: string | null
	opportunityId: string | null
	/** True when the Person record exists — the lead is not lost even if the Opportunity failed. */
	leadCaptured: boolean
	/** For logging only. Must never reach the browser: it reveals prior registration. */
	personExisted: boolean
	/** For logging only. */
	opportunityExisted: boolean
}

/** Amount of the programme, in EUR. Twenty stores currency in micros. */
const OPPORTUNITY_AMOUNT_EUR = 149
const MICROS = 1_000_000

/** Twenty's default opportunity pipeline stages. */
const INITIAL_STAGE = "NEW"

const REQUEST_TIMEOUT_MS = 10_000

/**
 * Split a full name into Twenty's { firstName, lastName }. Spanish names carry
 * two surnames, so everything after the first token is the last name.
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
	const parts = fullName.trim().split(/\s+/)
	if (parts.length === 1) return { firstName: parts[0]!, lastName: "" }
	return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") }
}

/**
 * Normalise a Spanish phone number into Twenty's phone composite. Strips a
 * leading +34 / 0034 so the national number and the calling code don't double up.
 */
function buildPhone(raw: string): Record<string, string> {
	const digits = raw.replace(/[^\d+]/g, "")
	const national = digits.replace(/^(\+34|0034|34(?=\d{9}$))/, "")
	return {
		primaryPhoneNumber: national,
		primaryPhoneCallingCode: "+34",
		primaryPhoneCountryCode: "ES",
	}
}

/** DD/MM/YYYY — how María reads a due date. */
function formatFpp(fpp: string): string {
	const [year, month, day] = fpp.split("-")
	return `${day}/${month}/${year}`
}

/**
 * Twenty's REST responses have varied across versions: some wrap the record in
 * `data.createPerson`, others in `data`. Accept every shape rather than break on
 * an upgrade.
 */
function extractId(json: unknown, operation: string): string | null {
	if (!json || typeof json !== "object") return null
	const root = json as Record<string, any>
	return root.data?.[operation]?.id ?? root.data?.id ?? root.id ?? null
}

interface TwentyResponse {
	ok: boolean
	status: number
	json: unknown
	text: string
}

async function twentyRequest(
	config: TwentyConfig,
	method: "GET" | "POST" | "PATCH",
	path: string,
	body?: Record<string, unknown>
): Promise<TwentyResponse> {
	const response = await fetch(`${config.baseUrl}${path}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.apiToken}`,
		},
		body: body ? JSON.stringify(body) : undefined,
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	})

	const text = await response.text().catch(() => "")
	let json: unknown = null
	try {
		json = text ? JSON.parse(text) : null
	} catch {
		// Non-JSON body (HTML error page, proxy timeout) — keep the text for the log.
	}

	return { ok: response.ok, status: response.status, json, text }
}

const twentyPost = (config: TwentyConfig, path: string, body: Record<string, unknown>) =>
	twentyRequest(config, "POST", path, body)

const twentyPatch = (config: TwentyConfig, path: string, body: Record<string, unknown>) =>
	twentyRequest(config, "PATCH", path, body)

const twentyGet = (config: TwentyConfig, path: string) => twentyRequest(config, "GET", path)

/**
 * First record id anywhere in a Twenty response.
 *
 * Twenty has shipped several wrappers for these payloads — `data.people`,
 * `data.personDuplicates`, a bare `data` array, and GraphQL-style
 * `edges[].node` — and the duplicates endpoint nests one level deeper than the
 * list endpoints. Rather than pin one shape and break on upgrade, walk the
 * structure for the first object carrying a string `id`.
 */
function findFirstId(value: unknown, depth = 0): string | null {
	if (depth > 6 || value === null || typeof value !== "object") return null

	if (Array.isArray(value)) {
		for (const item of value) {
			const found = findFirstId(item, depth + 1)
			if (found) return found
		}
		return null
	}

	const record = value as Record<string, unknown>
	if (typeof record.id === "string" && record.id.length > 0) return record.id

	for (const nested of Object.values(record)) {
		const found = findFirstId(nested, depth + 1)
		if (found) return found
	}
	return null
}

/** The Person fields we own. Never blanks an existing value with an empty one. */
function buildPersonBody(lead: LeadInput): Record<string, unknown> {
	const { firstName, lastName } = splitName(lead.name)
	const body: Record<string, unknown> = { name: { firstName, lastName } }
	if (lead.email) body.emails = { primaryEmail: lead.email }
	if (lead.phone) body.phones = buildPhone(lead.phone)
	return body
}

/**
 * Ask Twenty whether this email or phone already belongs to someone.
 *
 * Uses Twenty's own duplicate detection instead of a hand-written filter, so the
 * matching rules stay owned by the CRM and survive version upgrades.
 *
 * Returns null both when nobody matches and when the check itself fails: a
 * broken lookup must degrade to "create a new record", never to a lost lead. A
 * duplicate costs María a minute; a dropped lead is ad spend burned.
 */
async function findDuplicatePersonId(
	config: TwentyConfig,
	lead: LeadInput
): Promise<string | null> {
	// Nothing to match on — a nameless submission can't be deduplicated.
	if (!lead.email && !lead.phone) return null

	const candidate: Record<string, unknown> = {}
	if (lead.email) candidate.emails = { primaryEmail: lead.email }
	if (lead.phone) candidate.phones = buildPhone(lead.phone)

	const result = await twentyPost(config, "/rest/people/duplicates", { data: [candidate] })

	if (!result.ok) {
		logger.warn("Twenty duplicate check failed — will create instead of update", {
			status: result.status,
			detail: result.text.slice(0, 300),
		})
		return null
	}

	return findFirstId(result.json)
}

/**
 * Create or update the Person. Fails hard: without it there is no lead.
 */
async function upsertPerson(
	config: TwentyConfig,
	lead: LeadInput
): Promise<{ personId: string; existed: boolean }> {
	const body = buildPersonBody(lead)

	const existingId = await findDuplicatePersonId(config, lead)

	if (existingId) {
		const updated = await twentyPatch(config, `/rest/people/${existingId}`, body)
		if (!updated.ok) {
			// The record exists and that is what matters — keep going with the
			// stale contact details rather than failing the submission.
			logger.warn("Twenty updatePerson failed — keeping the existing record", {
				status: updated.status,
				personId: existingId,
				detail: updated.text.slice(0, 300),
			})
		}
		return { personId: existingId, existed: true }
	}

	const result = await twentyPost(config, "/rest/people", body)

	if (!result.ok) {
		logger.error("Twenty createPerson failed", new Error(`HTTP ${result.status}`), {
			status: result.status,
			detail: result.text.slice(0, 500),
		})
		throw new Error(`Twenty createPerson failed with ${result.status}`)
	}

	const personId = extractId(result.json, "createPerson")
	if (!personId) {
		logger.warn("Twenty createPerson returned no id", { detail: result.text.slice(0, 300) })
		throw new Error("Twenty createPerson returned no id")
	}

	return { personId, existed: false }
}

/** Built-in Twenty fields for the Opportunity. */
function buildOpportunityBase(lead: LeadInput, personId: string): Record<string, unknown> {
	return {
		name: `${formatFpp(lead.fpp)}`,
		amount: {
			amountMicros: OPPORTUNITY_AMOUNT_EUR * MICROS,
			currencyCode: "EUR",
		},
		stage: INITIAL_STAGE,
		pointOfContactId: personId,
	}
}

/** Base plus every mapped custom field that has a value. */
function buildOpportunityBody(
	lead: LeadInput,
	personId: string
): { body: Record<string, unknown>; base: Record<string, unknown>; hasCustomFields: boolean } {
	const base = buildOpportunityBase(lead, personId)
	const body: Record<string, unknown> = { ...base }

	for (const [leadKey, twentyField] of Object.entries(OPPORTUNITY_CUSTOM_FIELDS)) {
		const value = lead[leadKey as keyof LeadInput]
		// Skip null/empty so an absent utm doesn't overwrite a stored value with "".
		if (value === null || value === undefined || value === "") continue
		body[twentyField] = value
	}

	return { body, base, hasCustomFields: Object.keys(body).length > Object.keys(base).length }
}

/**
 * The Opportunity already linked to this contact, read from the contact's own
 * relation rather than a search query.
 *
 * `depth=1` makes Twenty include related records, so one GET gives us the
 * person's opportunities. Returns null on any failure, which means "create a new
 * one" — recoverable, unlike losing the submission.
 */
async function findOpportunityIdForPerson(
	config: TwentyConfig,
	personId: string
): Promise<string | null> {
	const result = await twentyGet(config, `/rest/people/${personId}?depth=1`)

	if (!result.ok) {
		logger.warn("Twenty person fetch failed — will create a new opportunity", {
			status: result.status,
			personId,
			detail: result.text.slice(0, 300),
		})
		return null
	}

	// Narrow to the opportunities relation before searching for an id, or we would
	// pick up the person's own id.
	const opportunities = findOpportunitiesNode(result.json)
	return opportunities ? findFirstId(opportunities) : null
}

/** Locate the `opportunities` collection wherever Twenty nests it. */
function findOpportunitiesNode(value: unknown, depth = 0): unknown {
	if (depth > 6 || value === null || typeof value !== "object") return null

	if (Array.isArray(value)) {
		for (const item of value) {
			const found = findOpportunitiesNode(item, depth + 1)
			if (found) return found
		}
		return null
	}

	const record = value as Record<string, unknown>
	if (record.opportunities) return record.opportunities

	for (const nested of Object.values(record)) {
		const found = findOpportunitiesNode(nested, depth + 1)
		if (found) return found
	}
	return null
}

/**
 * Create or update the Opportunity.
 *
 * Custom fields from OPPORTUNITY_CUSTOM_FIELDS are attempted first; if Twenty
 * rejects the payload (400/422 — a field missing or renamed) we retry once with
 * the built-in fields only, so a schema mismatch never costs a paid lead. The
 * logged `detail` names the offending field.
 *
 * On a returning lead the newest values win: a re-submitted due date is more
 * accurate, and the campaign that brought them back is the one worth crediting.
 * Empty values are skipped, so nothing already stored gets blanked.
 */
async function upsertOpportunity(
	config: TwentyConfig,
	lead: LeadInput,
	personId: string
): Promise<{ opportunityId: string | null; existed: boolean }> {
	const { body, base, hasCustomFields } = buildOpportunityBody(lead, personId)
	const existingId = await findOpportunityIdForPerson(config, personId)

	const path = existingId ? `/rest/opportunities/${existingId}` : "/rest/opportunities"
	const send = (payload: Record<string, unknown>) =>
		existingId ? twentyPatch(config, path, payload) : twentyPost(config, path, payload)

	// Stage is Twenty's own pipeline state — never drag a deal María already moved
	// forward back to NEW just because the lead resubmitted the form.
	if (existingId) {
		delete body.stage
		delete base.stage
	}

	let result = await send(body)

	if (!result.ok && (result.status === 400 || result.status === 422) && hasCustomFields) {
		logger.warn("Twenty rejected the opportunity custom fields — retrying without them", {
			status: result.status,
			detail: result.text.slice(0, 300),
		})
		result = await send(base)
	}

	if (!result.ok) {
		logger.error("Twenty upsertOpportunity failed", new Error(`HTTP ${result.status}`), {
			status: result.status,
			personId,
			existed: !!existingId,
			detail: result.text.slice(0, 500),
		})
		return { opportunityId: existingId, existed: !!existingId }
	}

	return {
		opportunityId: existingId ?? extractId(result.json, "createOpportunity"),
		existed: !!existingId,
	}
}

/**
 * Save a landing lead in Twenty, creating or updating as needed.
 *
 * Throws only when the Person could neither be found nor created. Everything
 * else degrades: a failed Opportunity still leaves a contactable lead, and the
 * caller reports the same success either way so the response never reveals
 * whether the email was already registered.
 */
export async function saveLeadInTwenty(
	config: TwentyConfig,
	lead: LeadInput
): Promise<TwentyResult> {
	const { personId, existed: personExisted } = await upsertPerson(config, lead)
	const { opportunityId, existed: opportunityExisted } = await upsertOpportunity(
		config,
		lead,
		personId
	)

	return {
		personId,
		opportunityId,
		leadCaptured: true,
		personExisted,
		opportunityExisted,
	}
}
