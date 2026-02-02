import { defineMiddleware } from "astro:middleware"

// Admin credentials - Move these to environment variables in production
const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || "change_this_password"

export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname

	// Check if accessing admin pages
	if (path.startsWith("/admin")) {
		const authHeader = context.request.headers.get("Authorization")

		if (!authHeader) {
			return new Response("Authentication required", {
				status: 401,
				headers: {
					"WWW-Authenticate": 'Basic realm="Admin Area"',
				},
			})
		}

		// Parse Basic Auth header
		const base64Credentials = authHeader.split(" ")[1]
		const credentials = atob(base64Credentials)
		const [username, password] = credentials.split(":")

		// Verify credentials
		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			return new Response("Invalid credentials", {
				status: 401,
				headers: {
					"WWW-Authenticate": 'Basic realm="Admin Area"',
				},
			})
		}

		// Credentials valid, continue to admin page
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
