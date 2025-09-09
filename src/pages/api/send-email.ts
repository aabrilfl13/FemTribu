import type { APIRoute } from "astro"
import { getWebhookConfig } from "@/utils/config.ts"

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

		if (!email) {
			return new Response(JSON.stringify({ error: "Email is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		if (mode != "auth" && !name) {
			return new Response(JSON.stringify({ error: "Name is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
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

		// Call the n8n webhook
		const response = await fetch(webhookConfig.webhookUrl, {
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
			throw new Error(`Webhook request failed: ${response.status} - ${response.statusText}`)
		}

		// Parse the webhook response
		let webhookData: WebhookResponse
		webhookData = await response.json()

		// Return the response including any redirect URL
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
		console.error("API error:", error)
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
