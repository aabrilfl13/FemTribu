import type { AuthResult, AuthSession, SignUpCredentials } from "./types"

export interface AuthProvider {
	// Authentication
	signUp(
		credentials: SignUpCredentials,
		options?: { cookies?: unknown; emailRedirectTo?: string }
	): Promise<AuthResult<AuthSession>>
}
