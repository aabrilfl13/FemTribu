import type { AuthResult, AuthSession, SignUpCredentials } from "./types"

export interface AuthProvider {
	// Authentication
	signUp(credentials: SignUpCredentials): Promise<AuthResult<AuthSession>>
}
