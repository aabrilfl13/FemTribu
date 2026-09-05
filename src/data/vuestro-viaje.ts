/**
 * «Vuestro viaje» — curso de preparación al parto online en pareja.
 *
 * Single source of truth for the landing page copy. A new edition means editing
 * only this file: dates, price, capacity, sessions, FAQs and video id.
 *
 * Plan and reasoning: data/vuestro-viaje-landing-plan.md
 */

export const EDITION = {
	/** Slug used in the lead payload so the CRM can group leads per edition. */
	slug: "nov-dic-2026",
	label: "Edición nov-dic 2026",
	/** Earliest accepted due date (fecha probable de parto). */
	fppFrom: "2026-11-19",
	/** Latest accepted due date. */
	fppTo: "2026-12-31",
	fppLabel: "19 de noviembre - 31 de diciembre de 2026",
	fppLabelShort: "FPP 19 nov - 31 dic 2026",
	/** TODO(client): confirm the month the course itself runs — the source copy said "octubre". */
	courseStartLabel: "octubre de 2026",
	price: 149,
	priceLabel: "149€",
	priceNote: "IVA incluido · por pareja",
	capacity: 8,
	capacityLabel: "Máximo 8 parejas",
} as const

/**
 * Campaign written to the CRM when the visitor arrives with no `utm_campaign` —
 * organic, direct, or a shared link. A real `utm_campaign` from the ad always
 * takes precedence, so paid traffic keeps its own campaign name and only
 * unattributed visits fall back to this.
 */
export const DEFAULT_CAMPAIGN = "vuestro-viaje"

/** TODO(client): real video id. Placeholder reuses the FemmBarre teaser. */
export const YOUTUBE_VIDEO_ID = "PEZMX_bK51E"

export const VIDEO = {
	id: YOUTUBE_VIDEO_ID,
	provider: "youtube" as const,
	title: "«Vuestro viaje» — curso de preparación al parto online en pareja",
	description:
		"Vídeo de presentación de «Vuestro viaje», el curso online e íntimo de preparación al parto para parejas, guiado por María Belenguer, matrona.",
	url: `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`,
	thumbnailUrl: `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`,
	/** TODO(client): real duration in seconds. */
	durationSeconds: 66,
	uploadDate: new Date("2026-09-05"),
} as const

export const HERO = {
	eyebrow: `${EDITION.label} · ${EDITION.capacityLabel}`,
	h1Lead: "Vuestro viaje",
	h1Tail: "preparaos juntos para el nacimiento de vuestro bebé",
	intro:
		"Un curso online e íntimo de preparación al parto para parejas, guiado por matrona. Trabajamos cuerpo, mente y vínculo para recibir a vuestro bebé con calma y consciencia.",
	chips: [EDITION.fppLabelShort, "4 sesiones en directo", `${EDITION.priceLabel} por pareja`],
	ctaLabel: "Cuéntame y te escribo",
	ctaNote: "Sin compromiso — te escribo para resolver tus dudas antes de nada.",
	whatsappLabel: "Prefiero WhatsApp",
} as const

export const QUALIFIER = {
	title: "¿Es este tu momento?",
	body: [
		`Este curso está pensado para parejas con fecha probable de parto entre el ${EDITION.fppLabel}. Abrimos un único grupo, de máximo ${EDITION.capacity} parejas, para que sea un espacio de verdad íntimo.`,
		"Si tu fecha no encaja en este rango, escríbeme igualmente — así te aviso en cuanto abra la siguiente edición.",
	],
	/** Shown to visitors whose due date falls outside the edition window. */
	fallbackLinks: [
		{
			href: "/servicios/preparacion-al-parto",
			label: "Preparación al parto individual",
		},
		{ href: "/servicios/femmbarre", label: "FemmBarre Maternity" },
	],
} as const

export const MECHANISM = {
	title: "Más que un curso: una transformación",
	intro:
		"Un espacio pensado como una transformación hacia el nacimiento, no como un curso teórico más. Por eso cuidamos también el ambiente de cada sesión, para que lo viváis como una experiencia real.",
	pillars: [
		{
			title: "Cuerpo",
			description:
				"Movimiento, posiciones y herramientas físicas para acompañar cada fase del parto.",
		},
		{
			title: "Mente",
			description:
				"Gestión del miedo, visualizaciones y anclajes para llegar al parto con confianza.",
		},
		{
			title: "Vínculo",
			description: "El papel activo del acompañante, para llegar al nacimiento como equipo.",
		},
	],
	pullQuote:
		"Trabajamos con mucho foco en la oxitocina: la hormona que protagoniza el parto y que necesita calma, calidez y confianza para fluir.",
} as const

export const SESSIONS = [
	{
		number: 1,
		title: "Bienvenida a la tribu + los 4 caminos hacia el nacimiento",
		description:
			"La fisiología de la oxitocina y el ambiente que la favorece. Un recorrido por los distintos escenarios de parto (espontáneo, inducido, cesárea urgente y programada) para saber qué esperar en cada uno.",
	},
	{
		number: 2,
		title: "El miedo y las herramientas para gestionarlo",
		description:
			"Un espacio para compartir y trabajar el miedo al parto: alivio del dolor, movimiento y posiciones, el papel activo del acompañante, visualizaciones y anclajes.",
	},
	{
		number: 3,
		title: "Después de nacer: el bebé y vosotros como pareja",
		description:
			"Cuidados básicos del recién nacido, la parte emocional del posparto, y cómo cuidaros como equipo en esta nueva etapa.",
	},
	{
		number: 4,
		title: "Lactancia y cierre",
		description:
			"Todo lo esencial sobre lactancia materna, de forma práctica y visual, y despedida de la tribu.",
	},
] as const

export const INCLUDED = [
	"Dudas conmigo por WhatsApp siempre que las necesitéis.",
	"Una sesión individual de seguimiento tras el parto, solo para vosotros.",
	"Un grupo de WhatsApp con el resto de la tribu.",
	"Una welcome box con material y detalles para vivir el curso también desde casa.",
] as const

export const ABOUT = {
	title: "Quién os acompaña",
	body: "Soy María Belenguer, matrona y creadora de Femm Tribu. Antes de crear mi propio espacio acompañé a mujeres en hospitales, y sigo formándome para acompañaros con la mayor cercanía y preparación posible. Creo que cada mujer y familia merece sentirse escuchada, acompañada y empoderada en cada etapa de su vida, y este curso nace de esa misma filosofía.",
} as const

/**
 * TODO(client): replace with real quotes from previous editions (name + FPP month).
 * The section is not rendered while this array is empty.
 */
export const TESTIMONIALS: { name: string; context: string; text: string }[] = []

/** TODO(client): answers marked below need confirming before launch. */
export const FAQS = [
	{
		question: "¿Las sesiones son en directo o grabadas?",
		answer: "TODO(client): confirmar formato, plataforma y si quedan grabadas para verlas después.",
	},
	{
		question: "¿Cuándo son las sesiones y cuánto duran?",
		answer: "TODO(client): confirmar días, horario y duración de cada sesión.",
	},
	{
		question: "¿Tiene que venir mi pareja a todas las sesiones?",
		answer:
			"El curso está diseñado para viviros como equipo, así que lo ideal es que vengáis los dos. Si alguna sesión le coincide con trabajo, no pasa nada: te cuento lo esencial y seguimos.",
	},
	{
		question: "¿Y si me pongo de parto antes de terminar el curso?",
		answer:
			"No perdéis nada. Seguimos acompañándoos por WhatsApp y mantenéis la sesión individual de seguimiento tras el parto.",
	},
	{
		question: "¿Sirve si ya hice preparación al parto en el centro de salud?",
		answer:
			"Sí. Aquí no repetimos la parte teórica: trabajamos el cuerpo, el miedo y el vínculo de pareja en un grupo de solo 8 parejas, con acompañamiento directo por WhatsApp durante todo el proceso.",
	},
	{
		question: "¿Y si mi fecha de parto no entra en el rango?",
		answer: `Escríbeme igualmente. Guardo tus datos y te aviso en cuanto abra la siguiente edición. Mientras tanto puedes preparar el parto en una sesión individual o mantenerte activa con FemmBarre Maternity.`,
	},
	{
		question: "¿Y si me hacen una cesárea programada?",
		answer:
			"El curso cubre los cuatro escenarios de parto, incluida la cesárea programada, para que sepáis qué esperar y cómo prepararos en cada caso.",
	},
	{
		question: "¿Cómo se paga y cuándo se confirma la plaza?",
		answer: "TODO(client): confirmar método de pago y cuándo queda reservada la plaza.",
	},
] as const

/** Cross-links, rendered after the form so they don't leak conversions. */
export const RELATED = [
	{
		href: "/servicios/femmbarre",
		title: "FemmBarre Maternity",
		description: "Barre prenatal online para mantenerte activa y preparar tu cuerpo para el parto.",
		price: "35€ / mes",
	},
	{
		href: "/servicios/preparacion-al-parto",
		title: "Preparación al parto individual",
		description:
			"Una sesión de dudas de 60 minutos, solo para ti, online o presencial en Valencia.",
		price: "50€ · 60 min",
	},
	{
		href: "/servicios/lactancia",
		title: "Asesoría de lactancia",
		description: "Para preparar y acompañar el inicio de la lactancia tras el nacimiento.",
		price: "50€ · 60 min",
	},
] as const

export const FORM = {
	title: "¿Empezamos?",
	intro:
		"Déjame tus datos y te escribo para contarte todo y resolver lo que necesites antes de reservar tu plaza.",
	/**
	 * Información básica de protección de datos ("capa 1" AEPD) junto al
	 * formulario. La política completa (/privacy) es la "capa 2".
	 */
	legalNote:
		"Responsable: María Belenguer (Femm tribu). Finalidad: contactarte sobre este curso. Legitimación: tu consentimiento. No cedemos tus datos a terceros. Derechos: info@femmtribu.es.",
	ctaLabel: "Cuéntame y te escribo",
	ctaNote: `Plazas limitadas a ${EDITION.capacity} parejas para la edición de ${EDITION.courseStartLabel}.`,
} as const

/** Success modal shown once the lead is saved. Replaces a thank-you page. */
export const SUCCESS = {
	title: "¡Gracias! Ya tengo tus datos",
	body: "Te escribo personalmente en las próximas 24 horas para contarte cómo es el curso y resolver todo lo que necesites antes de reservar nada.",
	scarcity: `Recuerda: solo hay ${EDITION.capacity} plazas para esta edición.`,
	whatsappLabel: "Escríbeme ya por WhatsApp",
	whatsappNote: "Si prefieres no esperar, escríbeme directamente.",
	shareLabel: "Compartir con tu pareja",
	shareCopiedLabel: "¡Enlace copiado!",
	shareTitle: "Vuestro viaje — curso de preparación al parto en pareja",
	shareText:
		"Mira este curso online de preparación al parto para parejas, con matrona y en grupo reducido:",
	closeLabel: "Cerrar",
} as const

export const SEO_DATA = {
	title: "Preparación al Parto Online en Pareja | Curso Matrona | Femm tribu",
	description:
		"Curso online en pareja para preparar el parto con matrona. Grupo íntimo de 8 parejas, 4 sesiones + seguimiento posparto. Edición nov-dic 2026. 149€.",
} as const
