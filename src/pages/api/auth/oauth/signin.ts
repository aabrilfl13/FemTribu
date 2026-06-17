import { signInWithOAuth } from "@auth"
import type { OAuthProvider } from "@auth"
import type { APIContext, APIRoute } from "astro"

import { getAuthCallbackUrl } from "@/config/auth"

export const prerender = false

export const POST: APIRoute = async (context: APIContext) => {
	try {
		const body = await context.request.json()
		const { provider } = body

		// Validation
		if (!provider) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "El proveedor de autenticación es obligatorio",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Validate provider
		const validProviders: OAuthProvider[] = ["google"]
		if (!validProviders.includes(provider)) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Proveedor de autenticación no válido",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Build callback URL using the request origin
		const siteUrl = new URL(context.request.url).origin
		const redirectTo = getAuthCallbackUrl(siteUrl, "emailVerification")

		// Call auth service signInWithOAuth
		const result = await signInWithOAuth(provider as OAuthProvider, {
			context,
			redirectTo,
			scopes: provider === "google" ? "email profile" : undefined,
		})

		if (result.error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Error al iniciar sesión con " + provider,
					code: result.error.code || "oauth_error",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		// Return the OAuth URL to redirect the user to
		return new Response(
			JSON.stringify({
				success: true,
				url: result.data!.url,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		)
	} catch (error) {
		console.error("OAuth signin error:", error)
		return new Response(
			JSON.stringify({
				success: false,
				error: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		)
	}
}
