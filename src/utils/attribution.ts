/**
 * Ad attribution capture (client-side).
 *
 * Reads campaign parameters from the landing URL and keeps them for the rest of
 * the session, so a visitor who browses before converting still arrives at the
 * CRM with the ad that brought them. Without this, every lead looks organic.
 *
 * Stored in sessionStorage: it dies with the tab, which is the right lifetime
 * for "which ad started this visit" and avoids a persistent identifier.
 */

const STORAGE_KEY = "femm-attribution"

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const

const CLICK_ID_KEYS = ["fbclid", "gclid", "ttclid", "msclkid"] as const

export interface Attribution {
	utm_source?: string
	utm_medium?: string
	utm_campaign?: string
	utm_content?: string
	utm_term?: string
	fbclid?: string
	gclid?: string
	ttclid?: string
	msclkid?: string
	referrer?: string
	landingPath?: string
}

/** Cap each value so a crafted URL can't push a huge payload to the CRM. */
const MAX_VALUE_LENGTH = 256

function read(): Attribution {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY)
		return raw ? (JSON.parse(raw) as Attribution) : {}
	} catch {
		return {}
	}
}

function write(data: Attribution): void {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch {
		// Private mode or storage disabled — attribution is best-effort.
	}
}

/**
 * Capture attribution from the current URL. First touch wins: an existing value
 * is never overwritten, so a mid-session internal link cannot erase the ad that
 * actually brought the visitor.
 */
export function captureAttribution(): Attribution {
	if (typeof window === "undefined") return {}

	const stored = read()
	const params = new URLSearchParams(window.location.search)
	const next: Attribution = { ...stored }
	let changed = false

	for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
		const value = params.get(key)
		if (!value || next[key]) continue
		next[key] = value.slice(0, MAX_VALUE_LENGTH)
		changed = true
	}

	if (!next.landingPath) {
		next.landingPath = window.location.pathname
		changed = true
	}

	// Only an external referrer is useful; our own pages tell us nothing.
	if (!next.referrer && document.referrer) {
		try {
			const ref = new URL(document.referrer)
			if (ref.host !== window.location.host) {
				next.referrer = document.referrer.slice(0, MAX_VALUE_LENGTH)
				changed = true
			}
		} catch {
			// Malformed referrer — ignore.
		}
	}

	if (changed) write(next)
	return next
}

/** Attribution captured so far this session. */
export function getAttribution(): Attribution {
	if (typeof window === "undefined") return {}
	return read()
}

/**
 * Event id shared by the browser pixel and the server-side Conversions API call
 * so Meta counts one conversion instead of two.
 */
export function createEventId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID()
	}
	return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
