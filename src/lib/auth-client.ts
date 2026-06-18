// Client-side auth state cache.
//
// Why this exists: Nav used to be a `server:defer` island, so every (full) page
// load re-rendered the logged-out fallback first, then swapped in the real user
// — a visible "Iniciar sesión / Regístrate" flash on each navigation.
//
// Now the nav shell is static and the auth widgets hydrate from this cache:
//   - First visit in a session (no cache): widgets render a neutral skeleton,
//     then `fetchUser()` resolves the real state once.
//   - Every later navigation: state is read synchronously from sessionStorage,
//     so there is no flash. A background `fetchUser()` keeps it fresh.
//
// sessionStorage (not localStorage) on purpose: scoped to the browsing session,
// which is exactly "while the user is surfing". A new tab/session re-checks once.
//
// This cache is display-only. The httpOnly session cookie remains authoritative
// and protected routes are still gated server-side in middleware.

export interface CachedUser {
	id: string
	email: string
	displayName: string | null
	avatarUrl: string | null
	emailVerified: boolean
	hasActiveFemmBarre?: boolean
}

// `undefined` = never checked this session (show skeleton)
// `null`      = checked, logged out (show login/register)
// CachedUser  = logged in
export type AuthState = CachedUser | null | undefined

const CACHE_KEY = "femm-user"

export function getCachedUser(): AuthState {
	if (typeof window === "undefined") return undefined
	try {
		const raw = window.sessionStorage.getItem(CACHE_KEY)
		if (raw === null) return undefined // never stored
		return JSON.parse(raw) as CachedUser | null // stored value (user or explicit null)
	} catch {
		return undefined
	}
}

export function setCachedUser(user: CachedUser | null): void {
	if (typeof window === "undefined") return
	try {
		window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(user))
	} catch {
		// storage full / disabled — ignore, fall back to network each time
	}
}

export function clearCachedUser(): void {
	if (typeof window === "undefined") return
	try {
		window.sessionStorage.removeItem(CACHE_KEY)
	} catch {
		// ignore
	}
}

// Fetches the authoritative auth state from the server and updates the cache.
// Returns the user (or null if logged out). Returns the previous cache value
// on a network error so a transient failure doesn't wipe a valid session.
export async function fetchUser(): Promise<CachedUser | null> {
	try {
		const res = await fetch("/api/user/me", {
			headers: { Accept: "application/json" },
			credentials: "same-origin",
		})

		if (res.status === 401) {
			setCachedUser(null)
			return null
		}

		if (!res.ok) {
			const prev = getCachedUser()
			return prev ?? null
		}

		const data = (await res.json()) as { user: CachedUser }
		setCachedUser(data.user)
		return data.user
	} catch {
		const prev = getCachedUser()
		return prev ?? null
	}
}
