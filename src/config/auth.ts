/**
 * Authentication configuration
 * Centralizes auth-related URLs and settings
 *
 * IMPORTANT: When changing callback paths, update your Supabase dashboard:
 * Authentication > URL Configuration > Redirect URLs
 * Add each environment's full callback URL:
 * - http://localhost:4321/auth/callback
 * - https://yourdomain.com/auth/callback
 */

export const AUTH_CONFIG = {
	/**
	 * Callback paths (relative to site URL)
	 * These are appended to the dynamic siteUrl from request headers
	 */
	callbacks: {
		emailVerification: "/auth/callback",
		passwordRecovery: "/auth/callback?type=recovery",
		magicLink: "/auth/callback",
	},

	/**
	 * Redirect paths after successful auth
	 */
	redirects: {
		afterLogin: "/perfil",
		afterLogout: "/",
		afterSignup: "/perfil?verified=true",
		afterPasswordReset: "/perfil/configuracion?tab=password",
	},

	/**
	 * Error redirect
	 */
	errorRedirect: "/auth/login",
} as const

/**
 * Helper to build full callback URL
 */
export function getAuthCallbackUrl(
	siteUrl: string,
	type: keyof typeof AUTH_CONFIG.callbacks = "emailVerification"
): string {
	return `${siteUrl}${AUTH_CONFIG.callbacks[type]}`
}
