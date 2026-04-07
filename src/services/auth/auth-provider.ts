import type { APIContext } from "astro"

import type {
	AuthResult,
	AuthSession,
	AuthUser,
	OAuthProvider,
	OAuthResponse,
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

	// OAuth authentication
	signInWithOAuth(
		provider: OAuthProvider,
		options?: {
			context?: APIContext
			redirectTo?: string
			scopes?: string
		}
	): Promise<AuthResult<OAuthResponse>>

	// OAuth/Email callback handling
	exchangeCodeForSession(
		code: string,
		options?: { context?: APIContext }
	): Promise<AuthResult<AuthSession>>

	getUser(context: APIContext): Promise<AuthResult<AuthUser>>

	getSession(context: APIContext): Promise<AuthResult<AuthSession>>
}
