import type { AuthResult, AuthSession, SignInCredentials, SignUpCredentials } from "./types"

export interface AuthProvider {
	// Authentication
	signUp(
		credentials: SignUpCredentials,
		options?: { cookies?: unknown; emailRedirectTo?: string }
	): Promise<AuthResult<AuthSession>>
	signIn(
		credentials: SignInCredentials,
		options?: { cookies?: unknown }
	): Promise<AuthResult<AuthSession>>
	signOut(options?: { cookies?: unknown }): Promise<AuthResult>

	// OAuth/Email callback handling
	exchangeCodeForSession(code: string, cookies?: unknown): Promise<AuthResult<AuthSession>>
}
