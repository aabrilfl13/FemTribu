import type { APIContext } from "astro"

import type {
	AuthResult,
	AuthSession,
	AuthUser,
	OAuthProvider,
	OAuthResponse,
	SignInCredentials,
	SignUpCredentials,
} from "../domain/auth.types"
import type { AuthProvider } from "../domain/ports/auth-provider.port"
import { SupabaseAuthProvider } from "../providers/supabase/supabase.provider"

/**
 * Module-level provider instance (lazy initialized)
 */
let _provider: AuthProvider | null = null

/**
 * Get the auth provider (lazy initialization).
 *
 * @example
 * const provider = getAuthProvider()
 * const result = await provider.getUser(context)
 */
export function getAuthProvider(): AuthProvider {
	if (!_provider) {
		_provider = new SupabaseAuthProvider()
	}

	return _provider
}

/**
 * Override the provider (for testing)
 *
 * @example
 * // In tests
 * import { injectAuthProvider, MockAuthProvider } from '@/auth'
 * injectAuthProvider(new MockAuthProvider())
 */
export function injectAuthProvider(provider: AuthProvider): void {
	_provider = provider
}

/**
 * Reset the provider to null (for testing).
 * Next call to getAuthProvider() will re-initialize from env var.
 *
 * @example
 * // In test cleanup
 * afterEach(() => {
 *   resetAuthProvider()
 * })
 */
export function resetAuthProvider(): void {
	_provider = null
}

export function signUp(
	credentials: SignUpCredentials,
	options?: { context?: APIContext; emailRedirectTo?: string }
): Promise<AuthResult<AuthSession>> {
	return getAuthProvider().signUp(credentials, options)
}

export function signIn(
	credentials: SignInCredentials,
	context: APIContext
): Promise<AuthResult<AuthSession>> {
	return getAuthProvider().signIn(credentials, context)
}

export function signOut(context: APIContext): Promise<AuthResult> {
	return getAuthProvider().signOut(context)
}

export function signInWithOAuth(
	provider: OAuthProvider,
	options?: { context?: APIContext; redirectTo?: string; scopes?: string }
): Promise<AuthResult<OAuthResponse>> {
	return getAuthProvider().signInWithOAuth(provider, options)
}

export function exchangeCodeForSession(
	code: string,
	options?: { context?: APIContext }
): Promise<AuthResult<AuthSession>> {
	return getAuthProvider().exchangeCodeForSession(code, options)
}

export function getUser(context: APIContext): Promise<AuthResult<AuthUser>> {
	return getAuthProvider().getUser(context)
}

export function getSession(context: APIContext): Promise<AuthResult<AuthSession>> {
	return getAuthProvider().getSession(context)
}
