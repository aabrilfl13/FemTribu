// Types
export type {
	AuthUser,
	AuthSession,
	AuthError,
	AuthResult,
	SignUpCredentials,
	SignInCredentials,
	PasswordResetRequest,
	PasswordUpdateRequest,
} from "./types"

// Provider interface
export type { AuthProvider } from "./auth-provider"

// Public API
export {
	getAuthProvider,
	signUp,
	signIn,
	signOut,
	exchangeCodeForSession,
	getUser,
} from "./auth-service"

// Client factories (for advanced use cases)
export { createSupabaseBrowserClient, createSupabaseServerClient } from "./supabase-client"
