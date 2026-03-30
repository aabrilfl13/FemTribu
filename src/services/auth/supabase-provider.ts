import type { AuthProvider } from "./auth-provider"
import { createSupabaseBrowserClient } from "./supabase-client"
import type { AuthResult, AuthSession, SignUpCredentials } from "./types"

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
}
