import type { APIRoute } from "astro"

import { getWebhookConfig } from "@/utils/config.ts"
import { logger } from "@/utils/logger.ts"

export const prerender = false

export const HEAD: APIRoute = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			"Cache-Control": "no-cache, no-store, must-revalidate",
			"Pragma": "no-cache",
			"Expires": "0",
		},
	})
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json()
		const { email } = body

		logger.info("Newsletter subscription attempt", { email })

		// Validate email
		if (!email || !email.includes("@")) {
			logger.warn("Invalid email provided", { email })
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

		let webhookConfig
		try {
			webhookConfig = getWebhookConfig()
		} catch (error) {
			logger.error("Webhook configuration error", error as Error)
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
			throw new Error(`Webhook failed with status ${response.status}`)
		}

		let webhookData = await response.json()

		logger.info("Newsletter subscription successful", {
			email,
			subscribed: webhookData.subscribed,
		})

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
		logger.error("Newsletter subscription error", error as Error, {
			endpoint: "/api/newsletter",
		})

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
