// Types
export type {
	AuthUser,
	AuthSession,
	AuthError,
	AuthResult,
	SignUpCredentials,
	SignInCredentials,
	OAuthProvider,
	OAuthResponse,
} from "./types"

// Provider interface
export type { AuthProvider } from "./auth-provider"

// Public API
export {
	getAuthProvider,
	signUp,
	signIn,
	signOut,
	signInWithOAuth,
	exchangeCodeForSession,
	getUser,
	getSession,
} from "./auth-service"

// Client factories (for advanced use cases)
export { createSupabaseBrowserClient, createSupabaseServerClient } from "./supabase-client"
