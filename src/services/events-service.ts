/**
 * Service for fetching general events (workshops, webinars, etc.)
 * This abstraction allows easy switching between mock data and real API calls
 */

export interface Event {
	slug: string
	title: string
	subtitle: string
	date: string // Format: "27 de Marzo 2026"
	dateISO: string // Format: "2026-03-27"
	time: string // Format: "18:00h" (display time)
	startTime: string // Format: "18:00:00" (HH:mm:ss)
	endTime: string // Format: "21:00:00" (HH:mm:ss)
	duration: string
	type: "Presencial" | "Online" | "Híbrido"
	location?: string // For in-person events
	locationAddress?: string // Full address for Google Maps
	price: string
	spots: number
	description: string
	whatYouWillLearn?: string[]
	schedule?: {
		time: string
		activity: string
		description?: string
	}[]
	facilitators?: {
		name: string
		role: string
		bio: string
		image?: string
		socialMedia?: {
			instagram?: string
			linkedin?: string
			website?: string
		}
	}[]
	includes?: string[]
	image: string
	gallery?: { id: string; src: string; alt: string }[]
	whatsappNumber: string
	seo: {
		title: string
		description: string
	}
}

// Configuration
const USE_MOCK_DATA = true // Set to false when backend is ready
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "https://api.femmtribu.es"

/**
 * Fetch all events from the backend
 *
 * @returns Promise with array of events
 *
 * @example
 * const events = await fetchEvents()
 */
export async function fetchEvents(): Promise<Event[]> {
	if (USE_MOCK_DATA) {
		// Import mock data
		const { events } = await import("@/data/events")
		return Promise.resolve(events)
	}

	// Real API call (for future implementation)
	try {
		const response = await fetch(`${API_BASE_URL}/events`, {
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch events: ${response.statusText}`)
		}

		const data = await response.json()
		return data.events || data
	} catch (error) {
		console.error("Error fetching events:", error)
		// Fallback to mock data if API fails
		const { events } = await import("@/data/events")
		return events
	}
}

/**
 * Fetch a specific event by slug from the backend
 *
 * @param slug - The event slug
 * @returns Promise with the event or undefined if not found
 *
 * @example
 * const event = await fetchEvent('pelvic-glow-experience-marzo-2026')
 */
export async function fetchEvent(slug: string): Promise<Event | undefined> {
	if (USE_MOCK_DATA) {
		// Import mock data
		const { getEvent } = await import("@/data/events")
		return Promise.resolve(getEvent(slug))
	}

	// Real API call (for future implementation)
	try {
		const response = await fetch(`${API_BASE_URL}/events/${slug}`, {
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			if (response.status === 404) {
				return undefined
			}
			throw new Error(`Failed to fetch event: ${response.statusText}`)
		}

		const data = await response.json()
		return data.event || data
	} catch (error) {
		console.error(`Error fetching event ${slug}:`, error)
		// Fallback to mock data if API fails
		const { getEvent } = await import("@/data/events")
		return getEvent(slug)
	}
}

/**
 * Generate Google Calendar link for an event
 * This is a utility function that works with any event data
 */
export function generateCalendarLink(
	event: Event,
	websiteUrl: string = "https://femmtribu.es"
): string {
	// Format: YYYYMMDDTHHMMSS
	const startDateTime = `${event.dateISO.replace(/-/g, "")}T${event.startTime.replace(/:/g, "")}`
	const endDateTime = `${event.dateISO.replace(/-/g, "")}T${event.endTime.replace(/:/g, "")}`

	const eventTitle = encodeURIComponent(event.title)
	const eventDescription = encodeURIComponent(
		`${event.description}\n\nMás información: ${websiteUrl}/eventos/${event.slug}`
	)
	const location = encodeURIComponent(event.location || "Online")

	return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTime}/${endDateTime}&details=${eventDescription}&location=${location}`
}

/**
 * Generate share links for social media
 */
export function generateShareLinks(event: Event, websiteUrl: string = "https://femmtribu.es") {
	const eventUrl = `${websiteUrl}/eventos/${event.slug}`
	const shareText = `${event.title}\n${event.date} a las ${event.time}\n${event.location || "Online"}\n\nÚnete a nosotras en este espacio para mujeres ✨`

	return {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + eventUrl)}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
		email: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareText + "\n\n" + eventUrl)}`,
		copyLink: eventUrl,
	}
}

/**
 * Generate WhatsApp reservation link
 */
export function generateWhatsAppReservationLink(event: Event, phoneNumber: string): string {
	const message = `Hola, estoy interesada en ${event.title} del ${event.date}`
	return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
