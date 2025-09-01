import type { APIRoute } from "astro"

export const prerender = false

interface WebhookResponse {
	success: boolean
	message?: string
	created?: boolean
	status?: string
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
