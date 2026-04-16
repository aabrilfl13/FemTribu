import type { APIContext } from "astro"

import type {
	AuthResult,
	AuthSession,
	AuthUser,
	OAuthProvider,
	OAuthResponse,
	SignInCredentials,
	SignUpCredentials,
} from "../auth.types"

export interface AuthProvider {
	signUp(
		credentials: SignUpCredentials,
		options?: { context?: APIContext; emailRedirectTo?: string }
	): Promise<AuthResult<AuthSession>>

	signIn(credentials: SignInCredentials, context: APIContext): Promise<AuthResult<AuthSession>>

	signOut(context: APIContext): Promise<AuthResult>

	signInWithOAuth(
		provider: OAuthProvider,
		options?: {
			context?: APIContext
			redirectTo?: string
			scopes?: string
		}
	): Promise<AuthResult<OAuthResponse>>

	exchangeCodeForSession(
		code: string,
		options?: { context?: APIContext }
	): Promise<AuthResult<AuthSession>>

	getUser(context: APIContext): Promise<AuthResult<AuthUser>>

	getSession(context: APIContext): Promise<AuthResult<AuthSession>>
}
