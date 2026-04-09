import type { APIContext, AstroCookies } from "astro"

import type {
	AuthError,
	AuthResult,
	AuthSession,
	AuthUser,
	OAuthProvider,
	OAuthResponse,
	SignInCredentials,
	SignUpCredentials,
} from "../../domain/auth.types"
import type { AuthProvider } from "../../domain/ports/auth-provider.port"
import { createSupabaseBrowserClient, createSupabaseServerClient } from "./supabase-client"

export class SupabaseAuthProvider implements AuthProvider {
	private supabase = createSupabaseBrowserClient()

	async signUp(
		credentials: SignUpCredentials,
		options?: { context?: APIContext; emailRedirectTo?: string }
	): Promise<AuthResult<AuthSession>> {
		const supabase = options?.context
			? createSupabaseServerClient({
					request: options.context.request,
					cookies: options.context.cookies,
				})
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
			return { data: null, error: this.mapError(error) }
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

		return { data: this.mapSession(data.session), error: null }
	}

	async signIn(
		credentials: SignInCredentials,
		context: APIContext
	): Promise<AuthResult<AuthSession>> {
		const supabase = context
			? createSupabaseServerClient({ request: context.request, cookies: context.cookies })
			: this.supabase

		const { data, error } = await supabase.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,
		})

		if (error) {
			return { data: null, error: this.mapError(error) }
		}

		return { data: this.mapSession(data.session), error: null }
	}

	async signOut(context: APIContext): Promise<AuthResult> {
		const supabase = context
			? createSupabaseServerClient({ request: context.request, cookies: context.cookies })
			: this.supabase

		const { error } = await supabase.auth.signOut()

		// refresh_token_not_found means the session was already cleared — treat as success
		if (error && error.code !== "refresh_token_not_found") {
			return { data: null, error: this.mapError(error) }
		}

		return { data: null, error: null }
	}

	async signInWithOAuth(
		provider: OAuthProvider,
		options?: {
			context?: APIContext
			redirectTo?: string
			scopes?: string
		}
	): Promise<AuthResult<OAuthResponse>> {
		const supabase = options?.context
			? createSupabaseServerClient({
					request: options.context.request,
					cookies: options.context.cookies,
				})
			: this.supabase

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: options?.redirectTo,
				scopes: options?.scopes,
			},
		})

		if (error) {
			return { data: null, error: this.mapError(error) }
		}

		return { data: { url: data.url, provider }, error: null }
	}

	async exchangeCodeForSession(
		code: string,
		options?: { context?: APIContext }
	): Promise<AuthResult<AuthSession>> {
		const supabase = options?.context
			? createSupabaseServerClient({
					request: options.context.request,
					cookies: options.context.cookies as AstroCookies,
				})
			: this.supabase

		const { data, error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			return { data: null, error: this.mapError(error) }
		}

		if (!data.session) {
			return {
				data: null,
				error: { message: "No se pudo crear la sesión", code: "session_creation_failed" },
			}
		}

		return { data: this.mapSession(data.session), error: null }
	}

	async getUser(context: APIContext): Promise<AuthResult<AuthUser>> {
		const supabase = createSupabaseServerClient({
			request: context.request,
			cookies: context.cookies,
		})

		const { data, error } = await supabase.auth.getUser()

		if (error) {
			return { data: null, error: this.mapError(error) }
		}

		if (!data.user) {
			return { data: null, error: null }
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("has_active_femm_barre")
			.eq("id", data.user.id)
			.single()

		return { data: this.mapUser(data.user, profile), error: null }
	}

	async getSession(context: APIContext): Promise<AuthResult<AuthSession>> {
		const supabase = createSupabaseServerClient({
			request: context.request,
			cookies: context.cookies,
		})

		const { data, error } = await supabase.auth.getSession()

		if (error) {
			return { data: null, error: this.mapError(error) }
		}

		if (!data.session) {
			return { data: null, error: null }
		}

		return {
			data: {
				accessToken: data.session.access_token,
				refreshToken: data.session.refresh_token,
				expiresAt: data.session.expires_at! * 1000,
				user: undefined, // fetch user separately when needed
			} as AuthSession,
			error: null,
		}
	}

	private mapUser(user: any, profile?: any): AuthUser {
		return {
			id: user.id,
			email: user.email!,
			displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || null,
			avatarUrl: user.user_metadata?.avatar_url || null,
			createdAt: new Date(user.created_at),
			emailVerified: !!user.email_confirmed_at,
			hasActiveFemmBarre: profile?.has_active_femm_barre || false,
		}
	}

	private mapSession(session: any): AuthSession {
		return {
			accessToken: session.access_token,
			refreshToken: session.refresh_token,
			expiresAt: session.expires_at! * 1000,
			user: session.user ? this.mapUser(session.user, undefined) : undefined,
		}
	}

	private mapError(error: any): AuthError {
		return {
			message: error.message || "Ha ocurrido un error",
			code: error.code || "unknown_error",
		}
	}
}
