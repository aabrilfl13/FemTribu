/**
 * Información de negocio centralizada para Femm tribu
 * Fuente única de verdad para datos de empresa, contacto, ubicación y redes sociales
 * Usado en todos los schemas (Organization, Person, LocalBusiness)
 */

export const BUSINESS_INFO = {
	// URLs y contacto
	siteUrl: "https://femmtribu.es",
	email: "info@femmtribu.es",
	phone: (() => {
		const number = import.meta.env.WHATSAPP_NUMBER || "640912048"
		return number.startsWith("+") ? number : `+34${number}`
	})(),

	// Dirección física
	address: {
		locality: "Valencia",
		region: "Comunidad Valenciana",
		postalCode: "46000",
		country: "ES",
	},

	// Coordenadas geográficas (centro de Valencia)
	geo: {
		latitude: 39.4699,
		longitude: -0.3763,
	},

	// Redes sociales
	socialLinks: [
		"https://www.instagram.com/femmtribu/",
		"https://www.tiktok.com/@merypebe",
		"https://chat.whatsapp.com/JYIdCr4B3nECmebwt0UqkM",
	],

	// Imágenes corporativas
	images: {
		logo: "/favicon.svg",
		ogImage: "/images/og-hands-together.webp",
		founderPortrait: "/images/mery-portrait.jpg",
	},

	// Información del fundador/profesional
	founder: {
		name: "María Belenguer",
		givenName: "María",
		familyName: "Belenguer",
		jobTitle: "Matrona",
		description:
			"Matrona especializada en acompañamiento integral a mujeres en todas las etapas de su vida. Combina ciencia, espiritualidad y autocuidado para ofrecer atención personalizada en lactancia, embarazo, parto, menopausia y salud hormonal.",
		expertise: [
			"Lactancia Materna",
			"Preparación al Parto",
			"Menopausia",
			"Salud Hormonal Femenina",
			"Ciclo Menstrual",
			"Suelo Pélvico",
			"Salud Sexual Femenina",
			"Consulta Preconcepcional",
			"Posparto",
		],
	},

	// Horarios de atención
	openingHours: {
		specification: [
			{
				days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "08:30",
				closes: "20:00",
			},
		],
		simple: "Mo-Fr 09:00-20:00", // Formato simple para Organization schema
	},

	// Métodos de pago
	paymentMethods: ["Cash", "Credit Card", "Bank Transfer"],

	// Rango de precios
	priceRange: "€€",
}

/**
 * Helper para obtener la dirección en formato Schema.org
 */
export function getSchemaAddress(includePostalCode = false) {
	const address: Record<string, string> = {
		"@type": "PostalAddress",
		"addressLocality": BUSINESS_INFO.address.locality,
		"addressRegion": BUSINESS_INFO.address.region,
		"addressCountry": BUSINESS_INFO.address.country,
	}

	if (includePostalCode) {
		address.postalCode = BUSINESS_INFO.address.postalCode
	}

	return address
}

/**
 * Helper para obtener URLs completas de imágenes
 */
export function getImageUrls(siteUrl: string) {
	return {
		logo: `${siteUrl}${BUSINESS_INFO.images.logo}`,
		ogImage: `${siteUrl}${BUSINESS_INFO.images.ogImage}`,
		founderPortrait: `${siteUrl}${BUSINESS_INFO.images.founderPortrait}`,
	}
}
