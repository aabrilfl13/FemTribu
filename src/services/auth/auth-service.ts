import type { AuthProvider } from "./auth-provider"
import { SupabaseAuthProvider } from "./supabase-provider"
import type { AuthResult, AuthSession, SignUpCredentials } from "./types"

// Single provider instance - change this line to switch auth backends
let provider: AuthProvider = new SupabaseAuthProvider()

/**
 * Get the active auth provider instance
 */
export function getAuthProvider(): AuthProvider {
	return provider
}

/**
 * Set a custom auth provider (useful for testing or switching backends)
 */
export function setAuthProvider(newProvider: AuthProvider): void {
	provider = newProvider
}

// Convenience exports - delegate to the active provider

export function signUp(credentials: SignUpCredentials): Promise<AuthResult<AuthSession>> {
	return provider.signUp(credentials)
}
