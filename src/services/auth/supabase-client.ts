import { createBrowserClient, createServerClient, parseCookieHeader } from "@supabase/ssr"
import type { APIContext, AstroCookies } from "astro"

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
export function createSupabaseServerClient({
	request,
	cookies,
}: {
	request: Request
	cookies: AstroCookies
}) {
	return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return parseCookieHeader(request.headers.get("Cookie") ?? "").map((cookie) => ({
					name: cookie.name,
					value: cookie.value || "",
				}))
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, options)
				})
			},
		},
	})
}
