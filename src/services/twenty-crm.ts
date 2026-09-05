/**
 * Twenty CRM adapter (REST API).
 *
 * A landing lead becomes two records:
 *   1. Person      — POST /rest/people
 *   2. Opportunity — POST /rest/opportunities, linked via pointOfContactId
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
	/** Custom field in Twenty, fed from utm_campaign. */
	campaign: string | null
}

export interface TwentyResult {
	personId: string | null
	opportunityId: string | null
	leadCaptured: boolean
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

async function twentyPost(
	config: TwentyConfig,
	path: string,
	body: Record<string, unknown>
): Promise<{ ok: boolean; status: number; json: unknown; text: string }> {
	const response = await fetch(`${config.baseUrl}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.apiToken}`,
		},
		body: JSON.stringify(body),
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

/**
 * Create the Person record. Fails hard: without it there is no lead.
 */
async function createPerson(config: TwentyConfig, lead: LeadInput): Promise<string> {
	const { firstName, lastName } = splitName(lead.name)

	const body: Record<string, unknown> = {
		name: { firstName, lastName },
	}
	if (lead.email) body.emails = { primaryEmail: lead.email }
	if (lead.phone) body.phones = buildPhone(lead.phone)

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

	return personId
}

/**
 * Create the Opportunity linked to the Person.
 *
 * The `campaign` custom field is attempted first; if Twenty rejects the payload
 * (400/422 — field missing or renamed) we retry once without custom fields, so a
 * schema mismatch in the CRM never costs a paid lead.
 */
async function createOpportunity(
	config: TwentyConfig,
	lead: LeadInput,
	personId: string
): Promise<string | null> {
	const base: Record<string, unknown> = {
		name: `${formatFpp(lead.fpp)}`,
		amount: {
			amountMicros: OPPORTUNITY_AMOUNT_EUR * MICROS,
			currencyCode: "EUR",
		},
		stage: INITIAL_STAGE,
		pointOfContactId: personId,
	}

	const withCustomFields: Record<string, unknown> = { ...base }
	if (lead.campaign) withCustomFields.campaign = lead.campaign
	if (lead.fpp) withCustomFields.fpp = lead.fpp

	const hasCustomFields =
		withCustomFields.campaign !== undefined || withCustomFields.fpp !== undefined

	let result = await twentyPost(config, "/rest/opportunities", withCustomFields)

	// Retry whenever custom fields were attached — either `campaign` or `fpp` may
	// be missing or renamed in Twenty, and neither is worth losing a paid lead over.
	if (!result.ok && (result.status === 400 || result.status === 422) && hasCustomFields) {
		logger.warn("Twenty rejected the opportunity custom fields — retrying without them", {
			status: result.status,
			detail: result.text.slice(0, 300),
		})
		result = await twentyPost(config, "/rest/opportunities", base)
	}

	if (!result.ok) {
		logger.error("Twenty createOpportunity failed", new Error(`HTTP ${result.status}`), {
			status: result.status,
			personId,
			detail: result.text.slice(0, 500),
		})
		return null
	}

	return extractId(result.json, "createOpportunity")
}

/**
 * Push a landing lead into Twenty.
 *
 * Throws only when the Person could not be created. A failed Opportunity is
 * logged and reported back, but the visitor still sees success — the contact
 * details are already saved and María can create the deal by hand.
 */
export async function createLeadInTwenty(
	config: TwentyConfig,
	lead: LeadInput
): Promise<TwentyResult> {
	const personId = await createPerson(config, lead)
	const opportunityId = await createOpportunity(config, lead, personId)

	return {
		personId,
		opportunityId,
		leadCaptured: true,
	}
}
