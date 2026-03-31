import type { APIRoute } from "astro"

import { getAuthCallbackUrl } from "@/config/auth"
import { signUp } from "@/services/auth"

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const body = await request.json()
		const { email, password, displayName } = body

		// Validation
		if (!email || !password) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Email y contraseña son obligatorios",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		if (!email.includes("@")) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "El email no es válido",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		if (password.length < 6) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "La contraseña debe tener al menos 6 caracteres",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Get the site URL from request headers
		const protocol = request.headers.get("x-forwarded-proto") || "http"
		const host = request.headers.get("host") || "localhost:4321"
		const siteUrl = `${protocol}://${host}`

		// Call auth service signUp
		const result = await signUp(
			{
				email,
				password,
				displayName,
			},
			{
				cookies,
				emailRedirectTo: getAuthCallbackUrl(siteUrl, "emailVerification"),
			}
		)

		if (result.error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: result.error.message,
					code: result.error.code,
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Success - check if session was created or email verification is required
		const hasSession = !!result.data

		return new Response(
			JSON.stringify({
				success: true,
				message: hasSession
					? "Cuenta creada exitosamente"
					: "Por favor verifica tu correo electrónico para completar el registro",
				session: hasSession,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		)
	} catch (error) {
		console.error("Error en registro:", error)
		return new Response(
			JSON.stringify({
				success: false,
				error: "Error al crear la cuenta. Por favor, inténtalo de nuevo.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		)
	}
}
