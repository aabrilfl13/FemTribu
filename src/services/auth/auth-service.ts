import type { APIContext } from "astro"

import type { AuthProvider } from "./auth-provider"
import { SupabaseAuthProvider } from "./supabase-provider"
import type {
	AuthResult,
	AuthSession,
	AuthUser,
	SignInCredentials,
	SignUpCredentials,
} from "./types"

// Single provider instance - change this line to switch auth backends
let provider: AuthProvider = new SupabaseAuthProvider()

/**
 * Get the active auth provider instance
 */
export function getAuthProvider(): AuthProvider {
	return provider
}

export function signUp(
	credentials: SignUpCredentials,
	options?: { context?: APIContext; emailRedirectTo?: string }
): Promise<AuthResult<AuthSession>> {
	return provider.signUp(credentials, options)
}

export function signIn(
	credentials: SignInCredentials,
	options?: { context?: APIContext }
): Promise<AuthResult<AuthSession>> {
	return provider.signIn(credentials, options?.context!)
}

export function signOut(options?: { context?: APIContext }): Promise<AuthResult> {
	return provider.signOut(options?.context!)
}

export function exchangeCodeForSession(
	code: string,
	options?: { context?: APIContext }
): Promise<AuthResult<AuthSession>> {
	return provider.exchangeCodeForSession(code, options)
}

export function getUser(context: APIContext): Promise<AuthResult<AuthUser>> {
	return provider.getUser(context)
}

export function getSession(context: APIContext): Promise<AuthResult<AuthSession>> {
	return provider.getSession(context)
}
