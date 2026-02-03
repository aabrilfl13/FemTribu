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

		logger.info("Newsletter unsubscribe attempt", { email })

		// Validate email
		if (!email || !email.includes("@")) {
			logger.warn("Invalid email provided for unsubscribe", { email })
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
		const response = await fetch(`${webhookConfig.webhookUrl}/newsletter/unsubscribe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// "Authorization": webhookConfig.authTokenNewsletter,
			},
			body: JSON.stringify({ email }),
		})

		if (!response.ok && response.status !== 204) {
			throw new Error(`Webhook failed with status ${response.status}`)
		}

		// Handle 204 No Content response (successful unsubscribe)
		if (response.status === 204) {
			logger.info("Newsletter unsubscribe successful", { email })

			return new Response(
				JSON.stringify({
					success: true,
					unsubscribed: true,
					message: "Te has dado de baja correctamente.",
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		// Handle responses with body (if any)
		let webhookData = await response.json()

		logger.info("Newsletter unsubscribe successful", {
			email,
			unsubscribed: webhookData.unsubscribed,
		})

		return new Response(
			JSON.stringify({
				success: true,
				unsubscribed: webhookData.unsubscribed,
				message: webhookData.message || "Te has dado de baja correctamente.",
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		logger.error("Newsletter unsubscribe error", error as Error, {
			endpoint: "/api/unsubscribe",
		})

		return new Response(
			JSON.stringify({
				success: false,
				message: "Error al darse de baja. Por favor, intenta de nuevo.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		)
	}
}
