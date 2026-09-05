import type { APIRoute } from "astro"

import { EDITION } from "@/data/vuestro-viaje"
import { createLeadInTwenty } from "@/services/twenty-crm.ts"
import { getCrmConfig } from "@/utils/config.ts"
import { logger } from "@/utils/logger.ts"

export const prerender = false

/** Cap free-text fields so a crafted request can't push junk into the CRM. */
const MAX_TEXT = 200

interface LeadRequest {
	name?: string
	email?: string
	phone?: string
	fpp?: string
	consent?: boolean
	eventId?: string
	/** Page-level campaign fallback, used only when utm_campaign is absent. */
	campaign?: string
	/** Honeypot — real users never fill this. */
	website?: string
	attribution?: Record<string, string>
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	})
}

function clean(value: unknown, max = MAX_TEXT): string {
	return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export const POST: APIRoute = async ({ request }) => {
	let payload: LeadRequest
	try {
		payload = await request.json()
	} catch {
		return jsonResponse({ success: false, error: "Petición no válida" }, 400)
	}

	const name = clean(payload.name)
	const email = clean(payload.email)
	const phone = clean(payload.phone)
	const fpp = clean(payload.fpp, 10)
	const consent = payload.consent === true

	// Honeypot: pretend success so bots don't learn they were caught.
	if (clean(payload.website)) {
		logger.warn("Lead form honeypot triggered")
		return jsonResponse({ success: true, message: "Gracias" }, 200)
	}

	if (!name) {
		return jsonResponse({ success: false, error: "Necesitamos tu nombre", field: "name" }, 400)
	}
	if (!phone && !email) {
		return jsonResponse(
			{ success: false, error: "Déjanos un teléfono o un email", field: "phone" },
			400
		)
	}
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
		return jsonResponse(
			{ success: false, error: "Ese email no parece válido", field: "email" },
			400
		)
	}
	// Health data (Art. 9 RGPD) — no explicit consent, no processing.
	if (!consent) {
		return jsonResponse(
			{
				success: false,
				error: "Necesitamos que aceptes la política de privacidad",
				field: "consent",
			},
			400
		)
	}

	let crm
	try {
		crm = getCrmConfig()
	} catch (error) {
		logger.error(
			"CRM configuration error",
			error instanceof Error ? error : new Error(String(error))
		)
		return jsonResponse({ success: false, error: "Error de configuración del servidor" }, 500)
	}

	const attribution = payload.attribution ?? {}
	// utm_campaign from the ad always wins; the page fallback only fills the gap
	// for organic, direct or shared-link visits.
	const campaign = clean(attribution.utm_campaign) || clean(payload.campaign) || null

	// Never log the lead's contact details or due date — FPP is health data.
	logger.info("Lead received", {
		edition: EDITION.slug,
		campaign,
		hasEmail: !!email,
		hasPhone: !!phone,
	})

	try {
		const result = await createLeadInTwenty(crm, {
			name,
			email: email || null,
			phone: phone || null,
			fpp,
			edition: EDITION.slug,
			source: "landing-vuestro-viaje",
			campaign,
		})

		if (!result.opportunityId) {
			// Person saved, deal not. The visitor is a captured lead either way, so
			// report success and let the alert on this log line prompt a manual fix.
			logger.warn("Lead saved without opportunity", { personId: result.personId, campaign })
		}

		return jsonResponse({ success: true }, 200)
	} catch (error) {
		logger.error(
			"Lead could not be saved in Twenty",
			error instanceof Error ? error : new Error(String(error)),
			{ campaign }
		)
		return jsonResponse(
			{ success: false, error: "No hemos podido guardar tus datos. Inténtalo de nuevo." },
			502
		)
	}
}
