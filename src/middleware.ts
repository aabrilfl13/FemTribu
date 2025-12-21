import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname

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
