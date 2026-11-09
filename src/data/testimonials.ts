/**
 * Testimonios reales, copiados tal cual de Google Business Profile.
 * Fuente única: cada testimonio se etiqueta con los servicios donde debe
 * aparecer (serviceIds, usa los id de SERVICES / ADDON_SERVICES en services.ts).
 *
 * No modificar el texto del cliente al añadir uno nuevo — solo se recorta
 * el nombre a "Nombre + inicial" por privacidad.
 */

export interface Testimonial {
	/** Nombre reducido a "Nombre I." — nunca el apellido completo ni el usuario de Google. */
	name: string
	text: string
	rating: 1 | 2 | 3 | 4 | 5
	/** Fecha aproximada en que se dejó la reseña (no hace falta el día exacto). */
	date: string
	source: "google"
	/** Enlace directo a esta reseña en Google (maps.app.goo.gl/...). Si falta, se enlaza al perfil general. */
	url?: string
	/** IDs de SERVICES/ADDON_SERVICES (services.ts) donde debe mostrarse. */
	serviceIds: string[]
}

/** Enlace a la ficha de Google para "ver todas las reseñas". */
export const GOOGLE_REVIEWS_URL = "https://share.google/TxFpehBPQy2Q3vrwQ"

export const TESTIMONIALS: Testimonial[] = [
	{
		name: "Álvaro C.",
		text: "Súper contento con el servicio ofrecido de primera puesta de pendientes a mi bebé. Súper amable y atenta en todo momento, lo recomiendo 100%. Ha sido una gran elección.",
		rating: 5,
		date: "noviembre 2026",
		source: "google",
		url: "https://maps.app.goo.gl/xnWjYoUGYGk2ubGV7",
		serviceIds: ["pendientes-bebe"],
	},
	{
		name: "Marta C.",
		text: "Contactamos con ella para ponerle los pendientes a nuestra pequeña de 2 meses y la verdad ha sido un gran acierto! Súper cercana y profesional, aún a posteriori de la puesta ha seguido pendiente de la evolución. Sin duda la recomendaré siempre ya que hemos quedado muy contentos.",
		rating: 5,
		date: "noviembre 2026",
		source: "google",
		url: "https://maps.app.goo.gl/K9Yo3wn9yUtBZGY46",
		serviceIds: ["pendientes-bebe"],
	},
]

export function getTestimonialsFor(serviceId: string): Testimonial[] {
	return TESTIMONIALS.filter((t) => t.serviceIds.includes(serviceId))
}
