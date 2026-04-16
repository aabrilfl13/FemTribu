export interface AuthUser {
	id: string
	email: string
	displayName: string | null
	avatarUrl: string | null
	createdAt: Date
	emailVerified: boolean
	hasActiveFemmBarre?: boolean
}

export interface AuthSession {
	accessToken: string
	refreshToken: string
	expiresAt: number
	user?: AuthUser
}

export interface SignUpCredentials {
	email: string
	password: string
	displayName?: string
}

export interface SignInCredentials {
	email: string
	password: string
}

export interface AuthError {
	message: string
	code: string
}

export interface AuthResult<T = void> {
	data: T | null
	error: AuthError | null
}

export type OAuthProvider = "google"

export interface OAuthResponse {
	url: string
	provider: OAuthProvider
}
