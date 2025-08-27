import type { APIRoute } from "astro"

export const prerender = false

interface WebhookResponse {
	success: boolean
	message?: string
	code?: string
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const { email } = await request.json()

		if (!email) {
			return new Response(JSON.stringify({ error: "Email is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Get auth token from environment variable (server-side only, secure)
		const webhook_url = import.meta.env.WEBHOOK_URL
		const authToken = import.meta.env.WEBHOOK_AUTH_TOKEN

		if (!webhook_url || !authToken) {
			console.error("WEBHOOK_URL or WEBHOOK_AUTH_TOKEN environment variables are not set")
			return new Response(JSON.stringify({ error: "Server configuration error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Call the n8n webhook
		const response = await fetch(webhook_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": authToken,
			},
			body: JSON.stringify({ email }),
		})

		if (!response.ok) {
			throw new Error(`Webhook request failed: ${response.status} - ${response.statusText}`)
		}

		// Parse the webhook response
		let webhookData: WebhookResponse
		try {
			webhookData = await response.json()
		} catch (parseError) {
			console.error("Error parsing webhook response:", parseError)
			// If response isn't JSON, treat as success but without redirect
			webhookData = { success: true }
		}

		// Return the response including any redirect URL
		return new Response(
			JSON.stringify({
				success: true,
				message: webhookData.message || "Email sent successfully",
				code: webhookData.code,
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
