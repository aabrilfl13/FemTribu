import type { APIContext, APIRoute } from "astro"

import { signIn } from "@/services/auth"

export const prerender = false

export const POST: APIRoute = async (context: APIContext) => {
	try {
		const body = await context.request.json()
		const { email, password } = body

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

		// Call auth service signIn
		const result = await signIn(
			{
				email,
				password,
			},
			{ context }
		)

		if (result.error) {
			// Provide user-friendly error messages
			let errorMessage = "Email o contraseña incorrectos"

			if (result.error.code === "invalid_password" || result.error.code === "invalid_login") {
				errorMessage = "Email o contraseña incorrectos"
			} else if (result.error.code === "email_not_confirmed") {
				errorMessage = "Por favor verifica tu correo electrónico antes de iniciar sesión"
			}

			return new Response(
				JSON.stringify({
					success: false,
					error: errorMessage,
					code: result.error.code || "signin_error",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Success - session cookies are automatically set by the server client
		return new Response(
			JSON.stringify({
				success: true,
				message: "Sesión iniciada exitosamente",
				user: {
					id: result.data!.user.id,
					email: result.data!.user.email,
					displayName: result.data!.user.displayName,
				},
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		)
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				error: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		)
	}
}
