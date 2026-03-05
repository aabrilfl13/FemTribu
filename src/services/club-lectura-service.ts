/**
 * Service for fetching Club de Lectura events
 * This abstraction allows easy switching between mock data and real API calls
 */

export interface ClubLecturaEvent {
	slug: string
	title: string
	subtitle: string
	date: string // Format: "27 de Marzo 2026"
	dateISO: string // Format: "2026-03-27"
	time: string // Format: "19:00h"
	timeISO: string // Format: "19:00:00"
	duration: string
	book: {
		title: string
		author: string
		coverImage: string
		description: string
		topics: string[]
	}
	whatsappLink: string
	seo: {
		title: string
		description: string
	}
}

// Configuration
const USE_MOCK_DATA = true // Set to false when backend is ready
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "https://api.femmtribu.es"

/**
 * Fetch all Club de Lectura events from the backend
 *
 * @returns Promise with array of Club de Lectura events
 *
 * @example
 * const events = await fetchClubLecturaEvents()
 */
export async function fetchClubLecturaEvents(): Promise<ClubLecturaEvent[]> {
	if (USE_MOCK_DATA) {
		// Import mock data
		const { clubLecturaEvents } = await import("@/data/club-lectura-events")
		return Promise.resolve(clubLecturaEvents)
	}

	// Real API call (for future implementation)
	try {
		const response = await fetch(`${API_BASE_URL}/club-lectura/events`, {
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch Club de Lectura events: ${response.statusText}`)
		}

		const data = await response.json()
		return data.events || data
	} catch (error) {
		console.error("Error fetching Club de Lectura events:", error)
		// Fallback to mock data if API fails
		const { clubLecturaEvents } = await import("@/data/club-lectura-events")
		return clubLecturaEvents
	}
}

/**
 * Fetch a specific Club de Lectura event by slug from the backend
 *
 * @param slug - The event slug
 * @returns Promise with the event or undefined if not found
 *
 * @example
 * const event = await fetchClubLecturaEvent('club-lectura-marzo-2026')
 */
export async function fetchClubLecturaEvent(slug: string): Promise<ClubLecturaEvent | undefined> {
	if (USE_MOCK_DATA) {
		// Import mock data
		const { getClubLecturaEvent } = await import("@/data/club-lectura-events")
		return Promise.resolve(getClubLecturaEvent(slug))
	}

	// Real API call (for future implementation)
	try {
		const response = await fetch(`${API_BASE_URL}/club-lectura/events/${slug}`, {
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			if (response.status === 404) {
				return undefined
			}
			throw new Error(`Failed to fetch Club de Lectura event: ${response.statusText}`)
		}

		const data = await response.json()
		return data.event || data
	} catch (error) {
		console.error(`Error fetching Club de Lectura event ${slug}:`, error)
		// Fallback to mock data if API fails
		const { getClubLecturaEvent } = await import("@/data/club-lectura-events")
		return getClubLecturaEvent(slug)
	}
}

/**
 * Generate Google Calendar link for an event
 * This is a utility function that works with any event data
 */
export function generateCalendarLink(
	event: ClubLecturaEvent,
	websiteUrl: string = "https://femmtribu.es"
): string {
	const startDateTime = `${event.dateISO.replace(/-/g, "")}T${event.timeISO.replace(/:/g, "").substring(0, 6)}`
	const endDateTime = `${event.dateISO.replace(/-/g, "")}T${event.timeISO.replace(/:/g, "").substring(0, 4)}00` // +1 hour

	const eventTitle = encodeURIComponent(event.title)
	const eventDescription = encodeURIComponent(
		`Un espacio para mujeres que quieren profundizar en su salud, su cuerpo y su historia a través de los libros. En esta edición leeremos ${event.book.title} de ${event.book.author}.\n\nMás información: ${websiteUrl}/eventos/club-lectura/${event.slug}`
	)
	const location = encodeURIComponent("Online")

	return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTime}/${endDateTime}&details=${eventDescription}&location=${location}`
}
