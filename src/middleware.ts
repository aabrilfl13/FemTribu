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
			// Redirect to login page
			return context.redirect("/admin/login")
		}

		// Token valid, continue to admin page
	}

	// Skip middleware for API routes to avoid header modification issues
	if (path.startsWith("/api/")) {
		return next()
	}

	const response = await next()

	// Allow AI training on blog content to spread expertise
	if (path.startsWith("/blog/")) {
		// Blog: Allow full AI training to help more people
		response.headers.set("X-Robots-Tag", "index, follow")
		// No TDM reservation for blog content
	} else {
		// Rest of site: Allow indexing but signal preference against training
		response.headers.set("X-Robots-Tag", "index, follow, noai, noimageai")

		// Signal Text and Data Mining reservation (EU copyright directive)
		response.headers.set("TDM-Reservation", "1")
	}

	// Privacy-focused permissions policy (applies to all pages)
	response.headers.set("Permissions-Policy", "browsing-topics=(), interest-cohort=()")

	return response
})
