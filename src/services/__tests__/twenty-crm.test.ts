import { beforeEach, describe, expect, it, vi } from "vitest"

import { saveLeadInTwenty, type LeadInput, type TwentyConfig } from "@/services/twenty-crm"

const config: TwentyConfig = {
	baseUrl: "https://crm.example.test",
	apiToken: "test-token",
}

const lead: LeadInput = {
	name: "Ana Ruiz García",
	email: "ana@example.test",
	phone: "+34 600 111 222",
	fpp: "2026-12-01",
	edition: "nov-dic-2026",
	source: "landing-vuestro-viaje",
	campaign: "vuestro-viaje-escasez",
	utmSource: "ig",
	utmMedium: "paid_social",
	utmContent: "vuestro-viaje-creatividad-a",
	utmTerm: "vuestro-viaje-adset-1",
	fbclid: "IwAR-test-click-id",
	landingPath: "/cursos/preparacion-al-parto-en-pareja",
	referrer: "https://l.instagram.com/",
}

function res(status: number, payload: unknown): Response {
	return {
		ok: status >= 200 && status < 300,
		status,
		text: () => Promise.resolve(typeof payload === "string" ? payload : JSON.stringify(payload)),
	} as unknown as Response
}

/** Twenty's duplicates endpoint: a match, or nothing. */
const duplicates = (id?: string) =>
	res(200, { data: { personDuplicates: [{ records: id ? [{ id }] : [] }] } })

/** GET /rest/people/{id}?depth=1 — the contact plus its relations. */
const personWithOpportunities = (personId: string, opportunityIds: string[] = []) =>
	res(200, {
		data: {
			person: {
				id: personId,
				opportunities: opportunityIds.map((id) => ({ id })),
			},
		},
	})

const created = (operation: string, id: string) => res(201, { data: { [operation]: { id } } })

interface Routes {
	/** POST /rest/people/duplicates */
	duplicateCheck?: Response
	personCreate?: Response
	personPatch?: Response
	/** GET /rest/people/{id}?depth=1 */
	personFetch?: Response
	/** Array = successive responses, for the custom-field retry. */
	oppWrite?: Response | Response[]
}

/**
 * Routes by method + path instead of call order, so adding a request to the
 * adapter doesn't invalidate every assertion in this file.
 */
function mockTwenty(routes: Routes = {}) {
	const {
		duplicateCheck = duplicates(),
		personCreate = created("createPerson", "person-1"),
		personPatch = res(200, { data: { updatePerson: { id: "person-1" } } }),
		personFetch = personWithOpportunities("person-1"),
		oppWrite = created("createOpportunity", "opp-1"),
	} = routes

	const oppQueue = Array.isArray(oppWrite) ? [...oppWrite] : [oppWrite]

	const fetchMock = vi.fn((url: string, init: { method: string; body?: string }) => {
		const method = init.method

		// Order matters: /duplicates is a POST under /rest/people.
		if (method === "POST" && url.includes("/rest/people/duplicates")) {
			return Promise.resolve(duplicateCheck)
		}
		if (method === "GET" && url.includes("/rest/people/")) return Promise.resolve(personFetch)
		if (method === "POST" && url.includes("/rest/people")) return Promise.resolve(personCreate)
		if (method === "PATCH" && url.includes("/rest/people")) return Promise.resolve(personPatch)
		if (url.includes("/rest/opportunities")) {
			return Promise.resolve(oppQueue.shift() ?? created("createOpportunity", "opp-1"))
		}
		throw new Error(`unrouted request: ${method} ${url}`)
	})

	vi.stubGlobal("fetch", fetchMock)
	return fetchMock
}

type FetchMock = ReturnType<typeof mockTwenty>

/** All calls matching a method and a path fragment. */
function callsFor(fetchMock: FetchMock, method: string, pathFragment: string) {
	return fetchMock.mock.calls.filter(
		([url, init]: any) => init.method === method && String(url).includes(pathFragment)
	)
}

/** POST /rest/people, excluding the /duplicates sub-path. */
function personCreates(fetchMock: FetchMock) {
	return fetchMock.mock.calls.filter(
		([url, init]: any) =>
			init.method === "POST" &&
			String(url).includes("/rest/people") &&
			!String(url).includes("/duplicates")
	)
}

function bodyFor(fetchMock: FetchMock, method: string, pathFragment: string) {
	const call = callsFor(fetchMock, method, pathFragment)[0]
	if (!call) throw new Error(`no ${method} call matching ${pathFragment}`)
	return JSON.parse((call as any)[1].body)
}

describe("saveLeadInTwenty — new lead", () => {
	let fetchMock: FetchMock

	beforeEach(() => {
		fetchMock = mockTwenty()
	})

	it("creates a Person then an Opportunity linked to it", async () => {
		const result = await saveLeadInTwenty(config, lead)

		expect(callsFor(fetchMock, "POST", "/rest/people?")).toHaveLength(0)
		expect(personCreates(fetchMock)).toHaveLength(1)
		expect(callsFor(fetchMock, "POST", "/rest/opportunities")).toHaveLength(1)
		expect(callsFor(fetchMock, "PATCH", "/rest")).toHaveLength(0)
		expect(result).toEqual({
			personId: "person-1",
			opportunityId: "opp-1",
			leadCaptured: true,
			personExisted: false,
			opportunityExisted: false,
		})
	})

	it("asks Twenty's duplicates endpoint with both email and phone", async () => {
		await saveLeadInTwenty(config, lead)

		const call = callsFor(fetchMock, "POST", "/rest/people/duplicates")
		expect(call).toHaveLength(1)
		expect(JSON.parse((call[0] as any)[1].body)).toEqual({
			data: [
				{
					emails: { primaryEmail: "ana@example.test" },
					phones: {
						primaryPhoneNumber: "600111222",
						primaryPhoneCallingCode: "+34",
						primaryPhoneCountryCode: "ES",
					},
				},
			],
		})
	})

	it("sends a Bearer token", async () => {
		await saveLeadInTwenty(config, lead)
		const [, init] = fetchMock.mock.calls[0] as any
		expect(init.headers.Authorization).toBe("Bearer test-token")
	})

	it("maps the Person to Twenty's composite field types", async () => {
		await saveLeadInTwenty(config, lead)

		expect(JSON.parse((personCreates(fetchMock)[0] as any)[1].body)).toEqual({
			name: { firstName: "Ana", lastName: "Ruiz García" },
			emails: { primaryEmail: "ana@example.test" },
			phones: {
				primaryPhoneNumber: "600111222",
				primaryPhoneCallingCode: "+34",
				primaryPhoneCountryCode: "ES",
			},
		})
	})

	it("still deduplicates a phone-only lead", async () => {
		await saveLeadInTwenty(config, { ...lead, email: null })

		const body = JSON.parse(
			(callsFor(fetchMock, "POST", "/rest/people/duplicates")[0] as any)[1].body
		)
		expect(body.data[0].emails).toBeUndefined()
		expect(body.data[0].phones.primaryPhoneNumber).toBe("600111222")
	})

	it("skips the duplicate check when there is no email and no phone", async () => {
		await saveLeadInTwenty(config, { ...lead, email: null, phone: null })

		expect(callsFor(fetchMock, "POST", "/rest/people/duplicates")).toHaveLength(0)
		expect(callsFor(fetchMock, "POST", "/rest/people")).toHaveLength(1)
	})

	it("omits email and phone when not provided", async () => {
		await saveLeadInTwenty(config, { ...lead, email: null, phone: null })

		const body = JSON.parse((personCreates(fetchMock)[0] as any)[1].body)
		expect(body.emails).toBeUndefined()
		expect(body.phones).toBeUndefined()
	})

	it("writes the amount in micros and every mapped custom field", async () => {
		await saveLeadInTwenty(config, lead)

		expect(bodyFor(fetchMock, "POST", "/rest/opportunities")).toEqual({
			name: "01/12/2026",
			amount: { amountMicros: 149000000, currencyCode: "EUR" },
			stage: "NEW",
			pointOfContactId: "person-1",
			fpp: "2026-12-01",
			campaign: "vuestro-viaje-escasez",
			utmSource: "ig",
			utmMedium: "paid_social",
			utmContent: "vuestro-viaje-creatividad-a",
			utmTerm: "vuestro-viaje-adset-1",
			fbclid: "IwAR-test-click-id",
			landingPath: "/cursos/preparacion-al-parto-en-pareja",
			referrer: "https://l.instagram.com/",
			edition: "nov-dic-2026",
			source: "landing-vuestro-viaje",
		})
	})

	it("omits attribution fields the visitor arrived without", async () => {
		await saveLeadInTwenty(config, {
			...lead,
			utmSource: null,
			utmMedium: null,
			utmContent: null,
			utmTerm: null,
			fbclid: null,
			referrer: null,
		})

		const body = bodyFor(fetchMock, "POST", "/rest/opportunities")
		for (const key of ["utmSource", "utmMedium", "utmContent", "utmTerm", "fbclid", "referrer"]) {
			expect(body).not.toHaveProperty(key)
		}
		expect(body.campaign).toBe("vuestro-viaje-escasez")
		expect(body.fpp).toBe("2026-12-01")
	})

	it("sends the due date on the Opportunity only, never on the Person", async () => {
		await saveLeadInTwenty(config, lead)

		expect(JSON.parse((personCreates(fetchMock)[0] as any)[1].body).fpp).toBeUndefined()
		expect(bodyFor(fetchMock, "POST", "/rest/opportunities").fpp).toBe("2026-12-01")
	})
})

describe("saveLeadInTwenty — returning lead", () => {
	const existing: Routes = {
		duplicateCheck: duplicates("person-existing"),
		personFetch: personWithOpportunities("person-existing", ["opp-existing"]),
		oppWrite: res(200, { data: { updateOpportunity: { id: "opp-existing" } } }),
	}

	it("updates the existing Person and Opportunity instead of duplicating", async () => {
		const fetchMock = mockTwenty(existing)

		const result = await saveLeadInTwenty(config, lead)

		expect(personCreates(fetchMock)).toHaveLength(0)
		expect(callsFor(fetchMock, "POST", "/rest/opportunities")).toHaveLength(0)
		expect(callsFor(fetchMock, "PATCH", "/rest/people/person-existing")).toHaveLength(1)
		expect(callsFor(fetchMock, "PATCH", "/rest/opportunities/opp-existing")).toHaveLength(1)
		expect(result).toEqual({
			personId: "person-existing",
			opportunityId: "opp-existing",
			leadCaptured: true,
			personExisted: true,
			opportunityExisted: true,
		})
	})

	it("refreshes the contact with the newest values", async () => {
		const fetchMock = mockTwenty(existing)

		await saveLeadInTwenty(config, { ...lead, name: "Ana Ruiz Nuevo", phone: "600999888" })

		expect(bodyFor(fetchMock, "PATCH", "/rest/people/person-existing")).toEqual({
			name: { firstName: "Ana", lastName: "Ruiz Nuevo" },
			emails: { primaryEmail: "ana@example.test" },
			phones: {
				primaryPhoneNumber: "600999888",
				primaryPhoneCallingCode: "+34",
				primaryPhoneCountryCode: "ES",
			},
		})
	})

	it("reads the opportunity from the contact's relation, not a search", async () => {
		const fetchMock = mockTwenty(existing)
		await saveLeadInTwenty(config, lead)

		const [url] = callsFor(fetchMock, "GET", "/rest/people/")[0] as any
		expect(url).toBe("https://crm.example.test/rest/people/person-existing?depth=1")
		expect(url).not.toContain("filter")
	})

	it("does not reset the pipeline stage of a deal already in progress", async () => {
		const fetchMock = mockTwenty(existing)
		await saveLeadInTwenty(config, lead)

		const body = bodyFor(fetchMock, "PATCH", "/rest/opportunities/opp-existing")
		expect(body).not.toHaveProperty("stage")
		// The refreshed values still go through.
		expect(body.fpp).toBe("2026-12-01")
		expect(body.campaign).toBe("vuestro-viaje-escasez")
	})

	it("creates an Opportunity when the contact has none yet", async () => {
		const fetchMock = mockTwenty({
			duplicateCheck: duplicates("person-existing"),
			personFetch: personWithOpportunities("person-existing"),
		})

		const result = await saveLeadInTwenty(config, lead)

		expect(callsFor(fetchMock, "POST", "/rest/opportunities")).toHaveLength(1)
		expect(result.personExisted).toBe(true)
		expect(result.opportunityExisted).toBe(false)
		expect(bodyFor(fetchMock, "POST", "/rest/opportunities").pointOfContactId).toBe(
			"person-existing"
		)
	})

	it("keeps the lead when updating the existing Person fails", async () => {
		const fetchMock = mockTwenty({
			...existing,
			personPatch: res(500, { messages: ["boom"] }),
		})

		const result = await saveLeadInTwenty(config, lead)

		expect(result.leadCaptured).toBe(true)
		expect(result.personId).toBe("person-existing")
		expect(personCreates(fetchMock)).toHaveLength(0)
	})
})

describe("saveLeadInTwenty — degradation", () => {
	it("creates instead of updating when the duplicate check fails", async () => {
		const fetchMock = mockTwenty({ duplicateCheck: res(404, { messages: ["no such route"] }) })

		const result = await saveLeadInTwenty(config, lead)

		expect(personCreates(fetchMock)).toHaveLength(1)
		expect(result.personExisted).toBe(false)
	})

	it("creates a new Opportunity when fetching the contact's relations fails", async () => {
		const fetchMock = mockTwenty({
			duplicateCheck: duplicates("person-existing"),
			personFetch: res(500, { messages: ["boom"] }),
		})

		const result = await saveLeadInTwenty(config, lead)

		expect(callsFor(fetchMock, "POST", "/rest/opportunities")).toHaveLength(1)
		expect(result.opportunityExisted).toBe(false)
	})

	it("retries the Opportunity without custom fields when Twenty rejects them", async () => {
		const fetchMock = mockTwenty({
			oppWrite: [
				res(400, { messages: ["Field campaign does not exist"] }),
				created("createOpportunity", "opp-1"),
			],
		})

		const result = await saveLeadInTwenty(config, lead)

		const writes = callsFor(fetchMock, "POST", "/rest/opportunities")
		expect(writes).toHaveLength(2)
		const retry = JSON.parse((writes[1] as any)[1].body)
		expect(retry.campaign).toBeUndefined()
		expect(retry.fpp).toBeUndefined()
		expect(retry.stage).toBe("NEW")
		expect(result.opportunityId).toBe("opp-1")
	})

	it("retries without custom fields when only fpp is set", async () => {
		const fetchMock = mockTwenty({
			oppWrite: [
				res(422, { messages: ["Field fpp does not exist"] }),
				created("createOpportunity", "opp-1"),
			],
		})

		const result = await saveLeadInTwenty(config, {
			...lead,
			campaign: null,
			utmSource: null,
			utmMedium: null,
			utmContent: null,
			utmTerm: null,
			fbclid: null,
			landingPath: null,
			referrer: null,
			edition: "",
			source: "",
		})

		expect(callsFor(fetchMock, "POST", "/rest/opportunities")).toHaveLength(2)
		expect(result.opportunityId).toBe("opp-1")
	})

	it("keeps the lead when the Opportunity cannot be created at all", async () => {
		mockTwenty({ oppWrite: [res(500, { messages: ["boom"] }), res(500, { messages: ["boom"] })] })

		const result = await saveLeadInTwenty(config, lead)

		expect(result.leadCaptured).toBe(true)
		expect(result.personId).toBe("person-1")
		expect(result.opportunityId).toBeNull()
	})

	it("throws when the Person cannot be created", async () => {
		mockTwenty({ personCreate: res(401, { messages: ["unauthorized"] }) })
		await expect(saveLeadInTwenty(config, lead)).rejects.toThrow(/createPerson failed with 401/)
	})

	it("accepts the alternative response shapes Twenty has shipped", async () => {
		mockTwenty({
			duplicateCheck: res(200, { data: [] }),
			personCreate: res(201, { data: { id: "flat-person" } }),
		})

		const result = await saveLeadInTwenty(config, lead)
		expect(result.personId).toBe("flat-person")
	})
})
