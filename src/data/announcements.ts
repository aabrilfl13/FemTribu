import type { Story } from "@/components/modals/StoriesModal.astro"

/**
 * Mock data - This will be replaced with real backend data
 */
const mockAnnouncementStories: Story[] = [
	{
		id: "webinar-lactancia",
		title: "Webinar gratuito: Lactancia materna",
		description:
			"Únete a María este sábado para aprender técnicas esenciales de lactancia. Plazas limitadas.",
		ctaText: "Reservar plaza gratis",
		ctaLink: "/webinars/lactancia",
		imageSrc: "/images/og-hands-together.webp",
	},
	{
		id: "taller-postparto",
		title: "Taller: Recuperación postparto",
		description:
			"Descubre cómo cuidar tu cuerpo después del parto con nuestro taller presencial en Valencia.",
		ctaText: "Más información",
		ctaLink: "/talleres/postparto",
		imageSrc: "/images/mujeres-circulo.webp",
	},
	{
		id: "evento-menopausia",
		title: "Círculo de mujeres: Menopausia consciente",
		description:
			"Un espacio seguro para compartir experiencias y aprender sobre esta etapa de transformación.",
		ctaText: "Apuntarme",
		ctaLink: "/eventos/menopausia",
		imageSrc: "/images/pregnant-woman.webp",
	},
	{
		id: "descuento-cursos",
		title: "20% en todos los cursos",
		description:
			"Aprovecha esta oferta especial. Usa el código BIENVENIDA20 al finalizar tu compra.",
		ctaText: "Ver cursos",
		ctaLink: "/cursos",
		backgroundColor: "#cb6e5f",
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
