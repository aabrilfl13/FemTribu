import type { ClubLecturaEvent } from "@/services/club-lectura-service"

export const clubLecturaEvents: ClubLecturaEvent[] = [
	{
		slug: "club-lectura-marzo-2026",
		title: "Club de Lectura FEMM",
		subtitle: "Edición de Marzo 2026",
		date: "26 de Marzo 2026",
		dateISO: "2026-03-26",
		time: "19:00h",
		startTime: "19:00:00",
		endTime: "20:00:00",
		duration: "Encuentro virtual de 1h aprox.",
		book: {
			title: "El sexo de las madres",
			author: "Sonia Encinas",
			coverImage: "/images/events/el-sexo-de-las-madres-Sonia-Encinas.webp",
			description:
				"Un libro imprescindible que habla sobre la sexualidad durante la maternidad, un tema del que poco se habla pero que muchas vivimos. Sonia Encinas nos invita a reconectar con nuestro cuerpo y nuestra sexualidad desde una perspectiva honesta, cercana y libre de juicios.",
			topics: [
				"La sexualidad durante el embarazo",
				"El posparto y los cambios en el deseo",
				"La reconexión con el placer",
				"Maternidad y pareja",
				"El cuerpo que cambia y se transforma",
			],
		},
		whatsappLink: "https://chat.whatsapp.com/L7nULEtmL38BfPJDgjKSUh?mode=gi_t",
		seo: {
			title: "Club de Lectura FEMM - 26 de Marzo 2026 | Femm tribu",
			description:
				"Únete al Club de Lectura FEMM. Un espacio para mujeres que quieren profundizar en su salud, su cuerpo y su historia a través de los libros. En esta edición leeremos 'El sexo de las madres' de Sonia Encinas.",
		},
	},
]

/**
 * Get a specific club de lectura event by slug
 */
export function getClubLecturaEvent(slug: string): ClubLecturaEvent | undefined {
	return clubLecturaEvents.find((event) => event.slug === slug)
}

/**
 * Get all club de lectura events
 */
export function getAllClubLecturaEvents(): ClubLecturaEvent[] {
	return clubLecturaEvents
}
