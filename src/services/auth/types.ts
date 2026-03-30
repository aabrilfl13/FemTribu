export interface AuthUser {
	id: string
	email: string
	displayName: string | null
	avatarUrl: string | null
	createdAt: Date
	emailVerified: boolean
}

export interface AuthSession {
	accessToken: string
	refreshToken: string
	expiresAt: number
	user: AuthUser
}

export interface SignUpCredentials {
	email: string
	password: string
	displayName?: string
}
export interface AuthError {
	message: string
	code: string
}

export interface AuthResult<T = void> {
	data: T | null
	error: AuthError | null
}
