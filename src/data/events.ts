import type { Event } from "@/services/events-service"

export const events: Event[] = [
	{
		slug: "pelvic-glow-experience-marzo-2026",
		title: "The Pelvic Glow Experience",
		subtitle: "Charla + Merienda + Clase de Barre",
		date: "27 de Marzo 2026",
		dateISO: "2026-03-27",
		time: "18:00h",
		startTime: "18:00:00",
		endTime: "21:00:00",
		duration: "3 horas aproximadamente",
		type: "Presencial",
		location: "Habitat, Valencia",
		locationAddress: "C/ d'Almassora, 44, Bajo Izquierda, La Zaidía, 46010 València, Valencia",
		price: "25€",
		spots: 15,
		description:
			"Un encuentro pensado para reconectar con tu cuerpo y aprender a cuidar tu salud pélvica desde una mirada cercana y práctica. El viernes 27 de marzo por la tarde, Paula Tejedo y yo ofreceremos un taller en el que combinaremos una charla de fisiosexología y suelo pélvico, merienda juntas y cerraremos la experiencia con una clase de barre.",
		whatYouWillLearn: [
			"Cómo mantener un suelo pélvico saludable",
			"Cómo manejar molestias o disfunciones frecuentes",
			"Qué hábitos pueden mejorar tu salud íntima",
			"Conectar con tu cuerpo a través del movimiento consciente",
		],
		schedule: [
			{
				time: "18:00h",
				activity: "Charla de Fisiosexología y Suelo Pélvico",
				description:
					"Paula Tejedo nos guiará en una conversación sobre cómo cuidar nuestra salud pélvica, entender nuestro cuerpo y prevenir disfunciones.",
			},
			{
				time: "18:45h",
				activity: "Merienda Juntas",
				description:
					"Un momento para compartir, conocernos y crear comunidad en un ambiente relajado y acogedor.",
			},
			{
				time: "19:15h",
				activity: "Clase de Barre",
				description:
					"Una práctica de movimiento suave y consciente que nos ayudará a integrar todo lo aprendido mientras conectamos con nuestro cuerpo.",
			},
		],
		facilitators: [
			{
				name: "Paula Tejedo",
				role: "Fisioterapeuta especializada en suelo pélvico",
				bio: "Experta en salud pélvica femenina y fisiosexología, Paula acompaña a mujeres en el cuidado de su cuerpo desde una mirada integradora y respetuosa.",
				image: "/images/about-me/paula-tejedo.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/paula.fisiosuelopelvico/",
					// linkedin: "",
					// website: "",
				},
			},
			{
				name: "María Belenguer",
				role: "Matrona y profesora de Barre",
				bio: "Matrona especializada en salud femenina y apasionada del movimiento consciente. Creadora de Femm Tribu.",
				image: "/images/about-me/mery-portait.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/femm.tribu/",
					linkedin: "https://www.linkedin.com/in/mar%C3%ADa-belenguer-p%C3%A9rez-b966593a0/",
					// website: "",
				},
			},
		],
		includes: [
			"Charla de fisiosexología y suelo pélvico",
			"Merienda saludable",
			"Clase de barre",
			"Material didáctico",
			"Espacio de comunidad y networking",
		],
		image: "/images/events/pelvic-glow.webp",
		whatsappNumber: "34640912048",
		seo: {
			title: "The Pelvic Glow Experience Valencia - Taller de Suelo Pélvico | 27 Marzo 2026",
			description:
				"Taller presencial de suelo pélvico y fisiosexología en Valencia. Charla con Paula Tejedo, fisioterapeuta especializada, merienda y clase de barre. Solo 15 plazas. ¡Reserva ahora!",
		},
	},
]

/**
 * Get a specific event by slug
 */
export function getEvent(slug: string): Event | undefined {
	return events.find((event) => event.slug === slug)
}

/**
 * Get all events
 */
export function getAllEvents(): Event[] {
	return events
}
