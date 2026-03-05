import type { Story } from "@/components/modals/StoriesModal.astro"

/**
 * Mock data - This will be replaced with real backend data
 */
const mockAnnouncementStories: Story[] = [
	{
		id: "evento-28-marzo",
		subtitle: "28 DE MARZO • VALENCIA",
		title: "¡Algo especial está por llegar!",
		description: "No es solo salud, no es solo barre...\n\nES AUTOTOCUIDADO VERSIÓN AVANZADA",
		ctaText: "Mantenerme informada",
		ctaLink: "/#newsletter",
		imageSrc: "/images/events/maria-exercise.webp",
		backgroundColor: "#37443a",
	},
	{
		id: "evento-27-marzo-lectura",
		subtitle: "27 DE MARZO • 19H • ONLINE",
		title: "Club de Lectura FEMM",
		description:
			"Un espacio para mujeres que quieren profundizar en su salud, su cuerpo y su historia a través de los libros.\n\nEn esta edición: \n\nEl sexo de las madres de Sonia Encinas",
		ctaText: "¡Quiero apuntarme!",
		ctaLink: "/eventos/club-lectura-marzo-2026",
		imageSrc: "/images/events/club-lectura-marzo-27.webp",
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
