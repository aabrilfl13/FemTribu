// API Endpoint: src/pages/api/newsletter.ts
import type { APIRoute } from "astro"

import { getWebhookConfig } from "@/utils/config.ts"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json()
		const { email } = body

		// Validate email
		if (!email || !email.includes("@")) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Por favor, introduce un email válido.",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		// Get webhook configuration from shared config utility
		let webhookConfig
		try {
			webhookConfig = getWebhookConfig()
		} catch (error) {
			console.error("Webhook configuration error:", error)
			return new Response(JSON.stringify({ error: "Server configuration error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Send to n8n webhook
		const response = await fetch(`${webhookConfig.webhookUrl}/newsletter`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": webhookConfig.authToken,
			},
			body: JSON.stringify({ email }),
		})

		if (!response.ok) {
			throw new Error("Webhook failed")
		}

		let webhookData = await response.json()

		return new Response(
			JSON.stringify({
				success: true,
				subscribed: webhookData.subscribed,
				message: webhookData.message || "¡Suscripción exitosa!",
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		console.error("Newsletter subscription error:", error)

		return new Response(
			JSON.stringify({
				success: false,
				message: "Error al suscribirse. Por favor, intenta de nuevo.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		)
	}
}
