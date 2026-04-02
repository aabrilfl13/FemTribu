import type { APIContext } from "astro"

import type {
	AuthResult,
	AuthSession,
	AuthUser,
	SignInCredentials,
	SignUpCredentials,
} from "./types"

export interface AuthProvider {
	// Authentication
	signUp(
		credentials: SignUpCredentials,
		options?: { context?: APIContext; emailRedirectTo?: string }
	): Promise<AuthResult<AuthSession>>
	signIn(credentials: SignInCredentials, context: APIContext): Promise<AuthResult<AuthSession>>
	signOut(context: APIContext): Promise<AuthResult>

	// OAuth/Email callback handling
	exchangeCodeForSession(
		code: string,
		options?: { context?: APIContext }
	): Promise<AuthResult<AuthSession>>
}
