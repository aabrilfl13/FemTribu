// Types
export type { AuthUser, AuthSession, AuthError, AuthResult, SignUpCredentials } from "./types"

// Provider interface
export type { AuthProvider } from "./auth-provider"

// Public API
export { getAuthProvider, setAuthProvider, signUp, exchangeCodeForSession } from "./auth-service"

// Client factories (for advanced use cases)
export { createSupabaseBrowserClient, createSupabaseServerClient } from "./supabase-client"
