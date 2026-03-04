import type { Story } from "@/components/modals/StoriesModal.astro"

/**
 * Mock data - This will be replaced with real backend data
 */
const mockAnnouncementStories: Story[] = [
	{
		id: "nuevos-eventos-2026",
		subtitle: "VALENCIA... ALGO ESTÁ PASANDO",
		title: "Coming soon!",
		description: "No es solo salud, no es solo barre...\n\nES AUTOTOCUIDADO VERSIÓN AVANZADA",
		ctaText: "Mantenerme informada",
		ctaLink: "/newsletter",
		imageSrc: "/images/pregnant-woman.webp",
		backgroundColor: "#37443a",
	},
]

/**
 * Fetch announcements stories
 *
 * This function simulates an API call. When you're ready to connect to a real backend,
 * simply replace the return statement with an actual fetch call.
 *
 * @returns Promise with array of announcement stories
 *
 * @example
 * // Future implementation with real API:
 * export async function getAnnouncements(): Promise<Story[]> {
 *   const response = await fetch('https://api.femtribu.com/announcements')
 *   if (!response.ok) throw new Error('Failed to fetch announcements')
 *   return response.json()
 * }
 */
export async function getAnnouncements(): Promise<Story[]> {
	// TODO: Replace with real API call when backend is ready
	// const response = await fetch('https://api.femtribu.com/announcements')
	// if (!response.ok) throw new Error('Failed to fetch announcements')
	// return response.json()

	// For now, return mock data
	return mockAnnouncementStories
}
