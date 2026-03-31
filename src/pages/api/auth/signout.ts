import type { APIRoute } from "astro"

import { signOut } from "@/services/auth"

export const prerender = false

export const POST: APIRoute = async ({ cookies }) => {
	try {
		// Call auth service signOut
		const result = await signOut({ cookies })

		if (result.error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Error al cerrar sesión",
					code: result.error.code || "signout_error",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Success - session cookies are automatically cleared by the server client
		return new Response(
			JSON.stringify({
				success: true,
				message: "Sesión cerrada exitosamente",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		)
	} catch (error) {
		console.error("Error al cerrar sesión:", error)
		return new Response(
			JSON.stringify({
				success: false,
				error: "Error al cerrar sesión. Por favor, inténtalo de nuevo.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		)
	}
}
