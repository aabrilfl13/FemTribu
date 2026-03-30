import { createBrowserClient, createServerClient } from "@supabase/ssr"
import type { AstroCookies } from "astro"

const SUPABASE_URL = import.meta.env.STORAGE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.STORAGE_SUPABASE_ANON_KEY

/**
 * Browser client — use in React components and client-side scripts
 */
export function createSupabaseBrowserClient() {
	return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Server client — use in middleware, API routes, and .astro page frontmatter.
 * Reads/writes session cookies through Astro's cookie API.
 */
export function createSupabaseServerClient(cookies: AstroCookies) {
	return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				// Supabase cookies follow pattern: sb-*-auth-token
				// We need to return all cookies that Supabase might need
				const allCookies: Array<{ name: string; value: string }> = []

				// Extract project ref from URL for cookie names
				const projectRef = SUPABASE_URL?.replace(/^https?:\/\//, "")
					.replace(/\./g, "-")
					.replace(/:/g, "-")

				// Common Supabase cookie patterns
				const cookiePatterns = [
					`sb-${projectRef}-auth-token`,
					`sb-${projectRef}-auth-token-code-verifier`,
					"sb-access-token",
					"sb-refresh-token",
				]

				for (const name of cookiePatterns) {
					const cookie = cookies.get(name)
					if (cookie?.value) {
						allCookies.push({ name, value: cookie.value })
					}
				}

				return allCookies
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, {
						path: "/",
						httpOnly: true,
						secure: import.meta.env.PROD,
						sameSite: "lax",
						...options,
					})
				})
			},
		},
	})
}
