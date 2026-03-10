import type { APIRoute } from "astro"

import { getWebhookConfig } from "@/utils/config.ts"
import { logger } from "@/utils/logger.ts"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
	try {
		const { name, email, phone, subject, message, contactPreference } = await request.json()
		logger.info("Contact form submission received", { email, phone, subject, hasName: !!name })

		if (!name || !message) {
			logger.warn("Contact form validation failed: missing required fields")
			return new Response(
				JSON.stringify({ success: false, error: "Nombre y mensaje son obligatorios" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		if (!email && !phone) {
			logger.warn("Contact form validation failed: no email or phone provided")
			return new Response(
				JSON.stringify({
					success: false,
					error: "Es necesario proporcionar al menos un email o teléfono",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		if (email && !email.includes("@")) {
			logger.warn("Contact form validation failed: invalid email", { email })
			return new Response(JSON.stringify({ success: false, error: "El email no es válido" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		let webhookConfig
		try {
			webhookConfig = getWebhookConfig()
		} catch (error) {
			logger.error(
				"Webhook configuration error",
				error instanceof Error ? error : new Error(String(error))
			)
			return new Response(
				JSON.stringify({ success: false, error: "Error de configuración del servidor" }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			)
		}

		logger.info("Calling contact webhook", {
			email,
			phone,
			subject,
			contactPreference,
			webhookConfig,
		})
		const response = await fetch(`${webhookConfig.webhookUrl}/contact/send-email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": webhookConfig.authToken,
			},
			body: JSON.stringify({ name, email, phone, subject, message, contactPreference }),
		})

		if (!response.ok) {
			logger.error(
				"Contact webhook request failed",
				new Error(`${response.status} - ${response.statusText}`),
				{ email, subject, status: response.status }
			)
			throw new Error(`Webhook request failed: ${response.status}`)
		}

		const webhookData = await response.json()
		logger.info("Contact webhook response received", { email, success: webhookData.success })

		return new Response(
			JSON.stringify({
				success: true,
				message: webhookData.message || "Mensaje enviado correctamente",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		)
	} catch (error) {
		logger.error("API error in contact", error instanceof Error ? error : new Error(String(error)))
		return new Response(
			JSON.stringify({
				success: false,
				error: "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		)
	}
}
