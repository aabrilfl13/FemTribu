/**
 * Fuente única de verdad para todos los servicios de Femm tribu
 * Si cambias precios o nombres aquí, se actualiza en toda la web automáticamente
 */

export interface ServiceData {
	id: string
	name: string
	nameShort: string
	description: string
	url: string
	priceMin: number
	priceMax: number
	serviceType: string
	type: "pack" | "addon" | "subscription"
	// SEO específico
	seo: {
		title: string
		description: string
	}
}

export interface AddonServiceData extends ServiceData {
	type: "addon"
	price: number
	features: string[]
	icon?: string
}

export const SERVICES: Record<string, ServiceData> = {
	lactancia: {
		id: "lactancia",
		name: "Asesoría de Lactancia",
		nameShort: "Lactancia",
		description:
			"Acompañamiento profesional y cercano en Valencia y online para resolver problemas de lactancia. Soluciones reales para el agarre, banco de leche, destete y más.",
		url: "/servicios/lactancia",
		priceMin: 70,
		priceMax: 220,
		serviceType: "Lactancia",
		type: "pack",
		seo: {
			title: "Asesoría Lactancia Valencia y Online | Femm tribu",
			description:
				"¿Dolor o dudas con tu lactancia? María Belenguer, matrona, te acompaña en Valencia y online. Soluciones reales para el agarre, banco de leche y destete.",
		},
	},
	preparacionParto: {
		id: "preparacion-parto",
		name: "Preparación al Parto",
		nameShort: "Preparación al Parto",
		description:
			"Prepara tu parto con ciencia y alma. Acompañamiento presencial en Valencia y online con matrona. Fisiología del parto, gestión del miedo, meditación y posparto.",
		url: "/servicios/preparacion-al-parto",
		priceMin: 90,
		priceMax: 250,
		serviceType: "Preparación al Parto",
		type: "pack",
		seo: {
			title: "Preparación al Parto Valencia y Online | Femm tribu",
			description:
				"Acompañamiento presencial en Valencia y online con matrona María Belenguer. Prepara tu parto con ciencia y alma: fisiología, gestión del miedo y posparto. ¡Confía en tu cuerpo!",
		},
	},
	menopausia: {
		id: "menopausia",
		name: "Acompañamiento en Menopausia",
		nameShort: "Menopausia",
		description:
			"Redefine tu menopausia con acompañamiento integral. Salud sexual, suelo pélvico, nutrición y hábitos saludables. Matrona en Valencia y online.",
		url: "/servicios/menopausia",
		priceMin: 80,
		priceMax: 250,
		serviceType: "Menopausia",
		type: "pack",
		seo: {
			title: "Menopausia Valencia y Online | Femm tribu",
			description:
				"Redefine tu menopausia con María Belenguer. Acompañamiento integral: salud sexual, suelo pélvico y hábitos saludables. Ciencia y alma en Valencia.",
		},
	},
	saludHormonal: {
		id: "salud-hormonal",
		name: "Acompañamiento en Salud Hormonal",
		nameShort: "Salud Hormonal",
		description:
			"Aprende a escuchar tu cuerpo. Asesoría en salud hormonal, ciclo menstrual, nutrición y consulta preconcepcional. Matrona en Valencia y online.",
		url: "/servicios/salud-hormonal",
		priceMin: 50,
		priceMax: 160,
		serviceType: "Salud Hormonal",
		type: "pack",
		seo: {
			title: "Salud Hormonal Valencia y Online | Femm tribu",
			description:
				"Aprende a escuchar tu cuerpo con María Belenguer. Asesoría en salud hormonal, nutrición y ciclo menstrual en Valencia y online. ¡Vive en sintonía contigo!",
		},
	},
	femmbarre: {
		id: "femmbarre",
		name: "FemmBarre Maternity",
		nameShort: "FemmBarre",
		description:
			"Programa de barre prenatal online para acompañarte durante el embarazo a través del movimiento consciente y el fortalecimiento corporal. Guiado por María, matrona e instructora de Barre.",
		url: "/servicios/femmbarre",
		priceMin: 35,
		priceMax: 35,
		serviceType: "FemmBarre Maternity",
		type: "subscription",
		seo: {
			title: "FemmBarre Maternity — Barre Prenatal Online | Femm tribu",
			description:
				"Barre prenatal online para embarazadas. Clase semanal en directo guiada por María, matrona e instructora de Barre. Movimiento consciente adaptado al embarazo. 35€/mes sin permanencia.",
		},
	},
} as const

export const ADDON_SERVICES: Record<string, AddonServiceData> = {
	pendientesBebe: {
		id: "pendientes-bebe",
		name: "Pendientes para Bebés",
		nameShort: "Pendientes Bebé",
		description:
			"Servicio de colocación de pendientes para bebés realizado por matrona profesional en Valencia. Seguro, higiénico y con materiales hipoalergénicos certificados.",
		url: "/servicios/pendientes-bebe",
		price: 60,
		priceMin: 60,
		priceMax: 60,
		serviceType: "Pendientes Bebé",
		type: "addon",
		features: [
			"Realizado por matrona profesional",
			"Material hipoalergénico",
			"Instrucciones de cuidado posteriores",
		],
		seo: {
			title: "Pendientes para Bebés en Valencia por Matrona | Femm tribu",
			description:
				"Colocación de pendientes para bebés en Valencia por matrona profesional. Materiales hipoalergénicos certificados, entorno seguro e instrucciones de cuidado incluidas.",
		},
	},
}

/**
 * Helper para obtener todos los servicios como array
 */
export function getAllServices(): ServiceData[] {
	return Object.values(SERVICES)
}

/**
 * Helper para obtener todos los servicios puntuales como array
 */
export function getAllAddonServices(): AddonServiceData[] {
	return Object.values(ADDON_SERVICES)
}

/**
 * Helper para obtener un servicio por ID (busca en ambos)
 */
export function getServiceById(id: string): ServiceData | undefined {
	return [...Object.values(SERVICES), ...Object.values(ADDON_SERVICES)].find(
		(service) => service.id === id
	)
}

/**
 * Helper para obtener el rango de precios como string
 */
export function getPriceRange(service: ServiceData): string {
	if (service.priceMin === service.priceMax) {
		return `${service.priceMin}€`
	}
	return `${service.priceMin}€ - ${service.priceMax}€`
}
