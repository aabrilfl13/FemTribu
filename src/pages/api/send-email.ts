import type { APIRoute } from "astro"

import { getWebhookConfig } from "@/utils/config.ts"
import { logger } from "@/utils/logger.ts"

export const prerender = false

interface WebhookResponse {
	success: boolean
	message?: string
	created?: boolean
	status?: string
	acceptedTerms?: boolean
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const { name, email, mode, acceptedTerms } = await request.json()
		logger.info("Send email request received", { email, mode, hasName: !!name })

		if (!email) {
			logger.warn("Email validation failed: missing email")
			return new Response(JSON.stringify({ error: "Email is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		if (mode != "auth" && !name) {
			logger.warn("Name validation failed", { email, mode })
			return new Response(JSON.stringify({ error: "Name is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Get webhook configuration from shared config utility
		let webhookConfig
		try {
			webhookConfig = getWebhookConfig()
			logger.info("Webhook config loaded successfully")
		} catch (error) {
			logger.error(
				"Webhook configuration error",
				error instanceof Error ? error : new Error(String(error))
			)
			return new Response(JSON.stringify({ error: "Server configuration error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Call the n8n webhook
		logger.info("Calling webhook", { email, mode, endpoint: "send-email" })
		const response = await fetch(`${webhookConfig.webhookUrl}/send-email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": webhookConfig.authToken,
			},
			body:
				mode === "auth"
					? JSON.stringify({ email, mode })
					: JSON.stringify({ name, email, mode, acceptedTerms }),
		})

		if (!response.ok) {
			logger.error(
				"Webhook request failed",
				new Error(`${response.status} - ${response.statusText}`),
				{ email, mode, status: response.status }
			)
			throw new Error(`Webhook request failed: ${response.status} - ${response.statusText}`)
		}

		// Parse the webhook response
		let webhookData: WebhookResponse
		webhookData = await response.json()
		logger.info("Webhook response received", {
			email,
			mode,
			success: webhookData.success,
			status: webhookData.status,
		})

		// Return the response including any redirect URL
		logger.info("Send email request completed successfully", {
			email,
			mode,
			created: webhookData.created,
		})
		return new Response(
			JSON.stringify({
				success: true,
				created: webhookData.created,
				message: webhookData.message,
				status: webhookData.status,
				acceptedTerms: webhookData.acceptedTerms,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		logger.error(
			"API error in send-email",
			error instanceof Error ? error : new Error(String(error))
		)
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "Internal server error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		)
	}
}
