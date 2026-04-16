// Domain Types
export type {
	AuthUser,
	AuthSession,
	AuthError,
	AuthResult,
	SignUpCredentials,
	SignInCredentials,
	OAuthProvider,
	OAuthResponse,
} from "./domain/auth.types"

// Provider Interface (Port)
export type { AuthProvider } from "./domain/ports/auth-provider.port"

// Public API (from DI Container)
export {
	getAuthProvider,
	injectAuthProvider,
	resetAuthProvider,
	signUp,
	signIn,
	signOut,
	signInWithOAuth,
	exchangeCodeForSession,
	getUser,
	getSession,
} from "./infrastructure/container"

// Providers
export { SupabaseAuthProvider } from "./providers/supabase/supabase.provider"

// Components
export { default as GoogleButton } from "./components/GoogleButton"

// Supabase client factories (for advanced use cases)
export {
	createSupabaseBrowserClient,
	createSupabaseServerClient,
} from "./providers/supabase/supabase-client"
