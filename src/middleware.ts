import { defineMiddleware } from "astro:middleware"

// Admin credentials - Move these to environment variables in production
const SECRET_KEY = import.meta.env.SECRET_KEY

// Simple token validation
function isValidToken(token: string): boolean {
	try {
		const decoded = atob(token)
		const [timestamp, hash] = decoded.split(":")
		const expiresAt = parseInt(timestamp)

		// Check if token is expired (1 day = 86400000 ms)
		if (Date.now() > expiresAt) {
			return false
		}

		// Verify hash
		const expectedHash = btoa(`${timestamp}:${SECRET_KEY}`)
		return hash === expectedHash
	} catch {
		return false
	}
}

export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname

	// Check if accessing admin pages (but not login)
	if (path.startsWith("/admin") && path !== "/admin/login") {
		// Check for auth token in cookie
		const authToken = context.cookies.get("admin_token")?.value

		if (!authToken || !isValidToken(authToken)) {
			// Redirect to login page with next parameter
			const nextUrl = encodeURIComponent(context.url.pathname + context.url.search)
			return context.redirect(`/admin/login?next=${nextUrl}`)
		}

		// Token valid, continue to admin page
	}

	return next()
})
