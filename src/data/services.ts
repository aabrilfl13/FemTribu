/**
 * Fuente única de verdad para todos los servicios de Femm tribu
 * Si cambias precios o nombres aquí, se actualiza en toda la web automáticamente
 */

export type ServiceKind = "consulta" | "pack" | "subscription" | "addon"
export type ServiceFormat = "online" | "presencial" | "both"

export interface ServiceData {
	id: string
	name: string
	nameShort: string
	description: string
	url: string
	priceMin: number
	priceMax: number
	serviceType: string
	type: ServiceKind
	duration?: string
	format?: ServiceFormat
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

/**
 * Precio único para todas las consultas individuales (50€ / 60 min).
 * Cambiar aquí actualiza las 5 consultas a la vez.
 */
export const CONSULTATION_PRICE = 50
export const CONSULTATION_DURATION = "60 minutos"

export const SERVICES: Record<string, ServiceData> = {
	lactancia: {
		id: "lactancia",
		name: "Asesoría de Lactancia",
		nameShort: "Lactancia",
		description:
			"Consulta individual con matrona especializada en lactancia en Valencia y online. Resolvemos dificultades de agarre, dolor, producción, banco de leche, lactancia mixta, vuelta al trabajo y destete respetuoso.",
		url: "/servicios/lactancia",
		priceMin: CONSULTATION_PRICE,
		priceMax: CONSULTATION_PRICE,
		duration: CONSULTATION_DURATION,
		format: "both",
		serviceType: "Consulta de Lactancia",
		type: "consulta",
		seo: {
			title: "Especialista en Lactancia Valencia | Asesoría Matrona | Femm tribu",
			description:
				"María Belenguer, especialista en lactancia en Valencia. Asesoría con matrona para agarre, dolor, producción, banco de leche y destete. Online y presencial. 50€ / 60 min.",
		},
	},
	preparacionParto: {
		id: "preparacion-parto",
		name: "Preparación al Parto",
		nameShort: "Preparación al Parto",
		description:
			"Sesión de dudas individual sobre embarazo, parto y posparto con matrona. Basada en evidencia científica. Fisiología del parto, plan de parto, intervenciones médicas, gestión del miedo y lactancia inicial. Programa grupal disponible por WhatsApp.",
		url: "/servicios/preparacion-al-parto",
		priceMin: CONSULTATION_PRICE,
		priceMax: CONSULTATION_PRICE,
		duration: CONSULTATION_DURATION,
		format: "both",
		serviceType: "Preparación al Parto",
		type: "consulta",
		seo: {
			title: "Preparación al Parto Valencia y Online | Matrona | Femm tribu",
			description:
				"Preparación al parto individual con matrona en Valencia y online. Fisiología del parto, plan de parto, gestión del miedo y posparto. Consulta 50€ / 60 min. Programa grupal bajo demanda.",
		},
	},
	menopausia: {
		id: "menopausia",
		name: "Consulta de Salud en Menopausia",
		nameShort: "Menopausia",
		description:
			"Acompañamiento en perimenopausia y menopausia con matrona. Gestión de sofocos, alteraciones del sueño, cambios emocionales, sequedad vaginal, salud ósea y hábitos de autocuidado. Enfoque natural y basado en evidencia.",
		url: "/servicios/menopausia",
		priceMin: CONSULTATION_PRICE,
		priceMax: CONSULTATION_PRICE,
		duration: CONSULTATION_DURATION,
		format: "online",
		serviceType: "Menopausia",
		type: "consulta",
		seo: {
			title: "Menopausia Valencia y Online | Consulta Matrona | Femm tribu",
			description:
				"Consulta de menopausia online con María Belenguer, matrona. Gestión de sofocos, sueño, cambios emocionales, sequedad vaginal y salud ósea. Enfoque natural y basado en evidencia. 50€ / 60 min.",
		},
	},
	saludHormonal: {
		id: "salud-hormonal",
		name: "Consulta de Salud Hormonal",
		nameShort: "Salud Hormonal",
		description:
			"Consulta de salud hormonal femenina con matrona. Dolor menstrual, síndrome premenstrual, ciclos irregulares, desajustes hormonales e identificación de las fases del ciclo. Educación, escucha del cuerpo y herramientas prácticas.",
		url: "/servicios/salud-hormonal",
		priceMin: CONSULTATION_PRICE,
		priceMax: CONSULTATION_PRICE,
		duration: CONSULTATION_DURATION,
		format: "both",
		serviceType: "Salud Hormonal",
		type: "consulta",
		seo: {
			title: "Salud Hormonal Femenina Valencia | Matrona | Femm tribu",
			description:
				"Consulta de salud hormonal femenina con María Belenguer. Dolor menstrual, SPM, ciclos irregulares y desajustes hormonales. Matrona en Valencia y online. 50€ / 60 min.",
		},
	},
	conoceTuCiclo: {
		id: "conoce-tu-ciclo",
		name: "Pack Conoce tu Ciclo",
		nameShort: "Conoce tu Ciclo",
		description:
			"Acompañamiento de 3 meses para aprender a entender, observar y conectar con tu ciclo menstrual. Seguimiento personalizado, sesiones individuales, educación sobre cada fase, interpretación de síntomas y recomendaciones adaptadas a tu estilo de vida.",
		url: "/servicios/conoce-tu-ciclo",
		priceMin: 120,
		priceMax: 120,
		duration: "3 meses",
		format: "online",
		serviceType: "Pack Conoce tu Ciclo",
		type: "pack",
		seo: {
			title: "Conoce tu Ciclo — Acompañamiento Menstrual 3 Meses | Femm tribu",
			description:
				"Pack 'Conoce tu Ciclo': 3 meses de acompañamiento online con matrona para entender tu ciclo menstrual, interpretar síntomas y conectar con tu cuerpo. 120€.",
		},
	},
	preconcepcional: {
		id: "preconcepcional",
		name: "Consulta Preconcepcional",
		nameShort: "Preconcepcional",
		description:
			"Consulta preconcepcional con matrona para preparar el embarazo de forma consciente y saludable. Revisión de salud general y hábitos, ciclo menstrual y ovulación, nutrición, suplementación básica y estilo de vida. Para mujeres y parejas en proceso de concepción.",
		url: "/servicios/preconcepcional",
		priceMin: CONSULTATION_PRICE,
		priceMax: CONSULTATION_PRICE,
		duration: CONSULTATION_DURATION,
		format: "both",
		serviceType: "Consulta Preconcepcional",
		type: "consulta",
		seo: {
			title: "Consulta Preconcepcional Valencia y Online | Matrona | Femm tribu",
			description:
				"Consulta preconcepcional con matrona en Valencia y online. Preparación consciente del embarazo: ciclo, ovulación, nutrición y suplementación. Para mujeres y parejas. 50€ / 60 min.",
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
		duration: "1 clase semanal",
		format: "online",
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
		format: "presencial",
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
 * Helper para obtener sólo las consultas individuales (50€ / 60 min)
 */
export function getAllConsultations(): ServiceData[] {
	return Object.values(SERVICES).filter((s) => s.type === "consulta")
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
