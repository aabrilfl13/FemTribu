import type { APIRoute } from "astro"

const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD
const SECRET_KEY = import.meta.env.SECRET_KEY

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const body = await request.json()
		const { username, password } = body

		// Verify credentials
		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			return new Response(JSON.stringify({ success: false, error: "Credenciales inválidas" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		}

		// Generate token (expires in 1 day)
		const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 1 day
		const hash = btoa(`${expiresAt}:${SECRET_KEY}`)
		const token = btoa(`${expiresAt}:${hash}`)

		// Set cookie (1 day expiration)
		cookies.set("admin_token", token, {
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day in seconds
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: "strict",
		})

		return new Response(JSON.stringify({ success: true, token, expiresAt }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}
}
