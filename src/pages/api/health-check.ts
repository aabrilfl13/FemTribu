import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
	const timestamp = new Date().toISOString()

	// Log for Vercel Cron monitoring
	console.log(`[Keep-Alive] ${timestamp} - Service healthy`)

	return new Response(
		JSON.stringify({
			status: "ok",
			timestamp: timestamp,
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				"Pragma": "no-cache",
				"Expires": "0",
			},
		}
	)
}

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
