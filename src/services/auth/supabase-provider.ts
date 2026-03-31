import type { AstroCookies } from "astro"

import type { AuthProvider } from "./auth-provider"
import { createSupabaseBrowserClient, createSupabaseServerClient } from "./supabase-client"
import type { AuthError, AuthResult, AuthSession, AuthUser, SignUpCredentials } from "./types"

export class SupabaseAuthProvider implements AuthProvider {
	private supabase = createSupabaseBrowserClient()

	async signUp(
		credentials: SignUpCredentials,
		options?: { cookies?: unknown; emailRedirectTo?: string }
	): Promise<AuthResult<AuthSession>> {
		// Use server client if cookies provided, otherwise browser client
		const supabase = options?.cookies
			? createSupabaseServerClient(options.cookies as AstroCookies)
			: this.supabase

		const { data, error } = await supabase.auth.signUp({
			email: credentials.email,
			password: credentials.password,
			options: {
				emailRedirectTo: options?.emailRedirectTo,
				data: {
					display_name: credentials.displayName || null,
				},
			},
		})

		if (error) {
			return {
				data: null,
				error: this.mapError(error),
			}
		}

		if (!data.session) {
			return {
				data: null,
				error: {
					message: "Por favor verifica tu correo electrónico para completar el registro",
					code: "email_verification_required",
				},
			}
		}

		return {
			data: this.mapSession(data.session),
			error: null,
		}
	}

	async exchangeCodeForSession(code: string, cookies?: unknown): Promise<AuthResult<AuthSession>> {
		// Use server client if cookies provided, otherwise browser client
		const supabase = cookies ? createSupabaseServerClient(cookies as AstroCookies) : this.supabase

		const { data, error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			return {
				data: null,
				error: this.mapError(error),
			}
		}

		if (!data.session) {
			return {
				data: null,
				error: {
					message: "No se pudo crear la sesión",
					code: "session_creation_failed",
				},
			}
		}

		return {
			data: this.mapSession(data.session),
			error: null,
		}
	}

	// Type mapping helpers
	private mapUser(user: any): AuthUser {
		return {
			id: user.id,
			email: user.email!,
			displayName: user.user_metadata?.display_name || null,
			avatarUrl: user.user_metadata?.avatar_url || null,
			createdAt: new Date(user.created_at),
			emailVerified: !!user.email_confirmed_at,
		}
	}

	private mapSession(session: any): AuthSession {
		return {
			accessToken: session.access_token,
			refreshToken: session.refresh_token,
			expiresAt: session.expires_at! * 1000, // Convert to milliseconds
			user: this.mapUser(session.user),
		}
	}

	private mapError(error: any): AuthError {
		return {
			message: error.message || "Ha ocurrido un error",
			code: error.code || "unknown_error",
		}
	}
}
