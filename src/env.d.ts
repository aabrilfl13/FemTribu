/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		user?: {
			id: string
			email: string
			displayName: string | null
			avatarUrl: string | null
			createdAt: Date
			emailVerified: boolean
			hasActiveFemmBarre?: boolean
		}
	}
}

interface Window {
	/** Google Analytics — loaded only after analytics consent. */
	gtag?: (...args: unknown[]) => void
	/** Meta Pixel — queue stub is always present, fbevents.js loads on marketing consent. */
	fbq?: (...args: unknown[]) => void
}

interface Navigator {
	/**
	 * User-Agent Client Hints. Chromium-only, so it is optional and callers must
	 * fall back to a media query for touch detection.
	 */
	userAgentData?: {
		mobile: boolean
		platform: string
		brands: { brand: string; version: string }[]
	}
}
