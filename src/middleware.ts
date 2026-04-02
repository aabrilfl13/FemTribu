import type { APIContext } from "astro"
import { defineMiddleware, sequence } from "astro:middleware"

import { AUTH_CONFIG } from "@/config/auth"

import { getSession, getUser } from "./services/auth/auth-service"

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

// Admin authentication middleware - unchanged
const adminAuth = defineMiddleware(async (context: APIContext, next) => {
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

// User authentication middleware
const userAuth = defineMiddleware(async (context: APIContext, next) => {
	// Define protected and auth-related paths
	const protectedPaths = ["/perfil"]
	const authPaths = ["/login", "/register", "/auth"]
	const path = context.url.pathname

	// Check if this is a protected or auth-related path
	const isProtected = protectedPaths.some((p) => path.startsWith(p))
	const isAuthRelated = authPaths.some((p) => path.startsWith(p))

	// Skip auth checks entirely for public pages (prerendered pages)
	// Only run auth for protected pages or auth-related pages
	if (!isProtected && !isAuthRelated) {
		return next()
	}

	// Get session (no user fetch yet - optimization)
	const { data: session } = await getSession(context)

	// For auth pages: redirect if already logged in (no need to fetch user)
	if (isAuthRelated && session) {
		return context.redirect("/perfil")
	}

	// For protected pages: fetch user data only when needed
	if (isProtected) {
		if (session) {
			const { data: user } = await getUser(context)
			context.locals.user = user!
		}

		// Redirect to login if not authenticated
		if (!context.locals.user) {
			const nextUrl = encodeURIComponent(context.url.pathname + context.url.search)
			return context.redirect(`${AUTH_CONFIG.errorRedirect}?next=${nextUrl}`)
		}
	}

	return next()
})

// Chain middlewares: admin auth runs first, then user auth
export const onRequest = sequence(adminAuth, userAuth)
