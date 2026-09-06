import { beforeEach, describe, expect, it, vi } from "vitest"

import { createLeadInTwenty, type LeadInput, type TwentyConfig } from "@/services/twenty-crm"

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

function ok(operation: string) {
	return {
		ok: true,
		status: 201,
		text: () =>
			Promise.resolve(JSON.stringify({ data: { [operation]: { id: `${operation}-1` } } })),
	} as unknown as Response
}

function fail(status: number, body = '{"messages":["nope"]}') {
	return {
		ok: false,
		status,
		text: () => Promise.resolve(body),
	} as unknown as Response
}

/** Body of the nth fetch call, parsed. */
function bodyOf(fetchMock: ReturnType<typeof vi.fn>, index: number) {
	return JSON.parse(fetchMock.mock.calls[index]![1].body)
}

describe("createLeadInTwenty", () => {
	let fetchMock: ReturnType<typeof vi.fn>

	beforeEach(() => {
		fetchMock = vi.fn()
		vi.stubGlobal("fetch", fetchMock)
	})

	it("creates a Person then an Opportunity linked to it", async () => {
		fetchMock
			.mockResolvedValueOnce(ok("createPerson"))
			.mockResolvedValueOnce(ok("createOpportunity"))

		const result = await createLeadInTwenty(config, lead)

		expect(fetchMock).toHaveBeenCalledTimes(2)
		expect(fetchMock.mock.calls[0]![0]).toBe("https://crm.example.test/rest/people")
		expect(fetchMock.mock.calls[1]![0]).toBe("https://crm.example.test/rest/opportunities")
		expect(result).toEqual({
			personId: "createPerson-1",
			opportunityId: "createOpportunity-1",
			leadCaptured: true,
		})
	})

	it("sends a Bearer token", async () => {
		fetchMock.mockResolvedValue(ok("createPerson"))
		await createLeadInTwenty(config, lead)
		expect(fetchMock.mock.calls[0]![1].headers.Authorization).toBe("Bearer test-token")
	})

	it("maps the Person to Twenty's composite field types", async () => {
		fetchMock.mockResolvedValue(ok("createPerson"))
		await createLeadInTwenty(config, lead)

		expect(bodyOf(fetchMock, 0)).toEqual({
			name: { firstName: "Ana", lastName: "Ruiz García" },
			emails: { primaryEmail: "ana@example.test" },
			phones: {
				primaryPhoneNumber: "600111222",
				primaryPhoneCallingCode: "+34",
				primaryPhoneCountryCode: "ES",
			},
		})
	})

	it("omits email and phone when not provided", async () => {
		fetchMock.mockResolvedValue(ok("createPerson"))
		await createLeadInTwenty(config, { ...lead, email: null, phone: null })

		const body = bodyOf(fetchMock, 0)
		expect(body.emails).toBeUndefined()
		expect(body.phones).toBeUndefined()
	})

	it("names the opportunity by due date and puts the amount in micros", async () => {
		fetchMock
			.mockResolvedValueOnce(ok("createPerson"))
			.mockResolvedValueOnce(ok("createOpportunity"))
		await createLeadInTwenty(config, lead)

		expect(bodyOf(fetchMock, 1)).toEqual({
			name: "01/12/2026",
			amount: { amountMicros: 149000000, currencyCode: "EUR" },
			stage: "NEW",
			pointOfContactId: "createPerson-1",
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

	it("retries the Opportunity without custom fields when Twenty rejects them", async () => {
		fetchMock
			.mockResolvedValueOnce(ok("createPerson"))
			.mockResolvedValueOnce(fail(400))
			.mockResolvedValueOnce(ok("createOpportunity"))

		const result = await createLeadInTwenty(config, lead)

		expect(fetchMock).toHaveBeenCalledTimes(3)
		expect(bodyOf(fetchMock, 2).campaign).toBeUndefined()
		expect(result.opportunityId).toBe("createOpportunity-1")
	})

	it("keeps the lead when the Opportunity cannot be created at all", async () => {
		fetchMock.mockResolvedValueOnce(ok("createPerson")).mockResolvedValueOnce(fail(500))

		const result = await createLeadInTwenty(config, lead)

		expect(result.leadCaptured).toBe(true)
		expect(result.personId).toBe("createPerson-1")
		expect(result.opportunityId).toBeNull()
	})

	it("omits attribution fields the visitor arrived without", async () => {
		fetchMock
			.mockResolvedValueOnce(ok("createPerson"))
			.mockResolvedValueOnce(ok("createOpportunity"))

		await createLeadInTwenty(config, {
			...lead,
			utmSource: null,
			utmMedium: null,
			utmContent: null,
			utmTerm: null,
			fbclid: null,
			referrer: null,
		})

		const body = bodyOf(fetchMock, 1)
		for (const key of ["utmSource", "utmMedium", "utmContent", "utmTerm", "fbclid", "referrer"]) {
			expect(body).not.toHaveProperty(key)
		}
		// The ones that are always present still go.
		expect(body.campaign).toBe("vuestro-viaje-escasez")
		expect(body.fpp).toBe("2026-12-01")
	})

	it("throws when the Person cannot be created", async () => {
		fetchMock.mockResolvedValueOnce(fail(401))
		await expect(createLeadInTwenty(config, lead)).rejects.toThrow(/createPerson failed with 401/)
	})

	it("accepts the alternative response shapes Twenty has shipped", async () => {
		const flat = {
			ok: true,
			status: 201,
			text: () => Promise.resolve(JSON.stringify({ data: { id: "flat-person" } })),
		} as unknown as Response
		fetchMock.mockResolvedValueOnce(flat).mockResolvedValueOnce(ok("createOpportunity"))

		const result = await createLeadInTwenty(config, lead)
		expect(result.personId).toBe("flat-person")
	})

	it("sends the due date on the Opportunity only, never on the Person", async () => {
		fetchMock
			.mockResolvedValueOnce(ok("createPerson"))
			.mockResolvedValueOnce(ok("createOpportunity"))
		await createLeadInTwenty(config, lead)

		expect(bodyOf(fetchMock, 0).fpp).toBeUndefined()
		expect(bodyOf(fetchMock, 1).fpp).toBe("2026-12-01")
	})

	it("retries without custom fields when only fpp is set and Twenty rejects it", async () => {
		fetchMock
			.mockResolvedValueOnce(ok("createPerson"))
			.mockResolvedValueOnce(fail(422))
			.mockResolvedValueOnce(ok("createOpportunity"))

		const result = await createLeadInTwenty(config, { ...lead, campaign: null })

		expect(fetchMock).toHaveBeenCalledTimes(3)
		const retry = bodyOf(fetchMock, 2)
		expect(retry.fpp).toBeUndefined()
		expect(retry.campaign).toBeUndefined()
		expect(result.opportunityId).toBe("createOpportunity-1")
	})
})
