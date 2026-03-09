/**
 * Preguntas frecuentes para la homepage
 * Estas FAQs generan rich snippets en Google (FAQ Schema)
 * Enfocadas en las búsquedas más comunes sobre matronas y salud femenina
 */

export interface FAQ {
	question: string
	answer: string
}

export const HOME_FAQS: FAQ[] = [
	{
		question: "¿Qué hace una matrona y en qué se diferencia de un ginecólogo?",
		answer: "Una matrona es una profesional sanitaria especializada en el acompañamiento de la mujer en todas las etapas de su vida reproductiva y hormonal. Mientras que el ginecólogo se centra en el diagnóstico y tratamiento médico, la matrona ofrece un acompañamiento integral que incluye educación, apoyo emocional y seguimiento personalizado. En Femm tribu, combinamos ciencia, espiritualidad y autocuidado para cuidarte de forma completa.",
	},
	{
		question: "¿Las consultas son online o presenciales?",
		answer: "Ofrecemos ambas modalidades. Las consultas presenciales se realizan en Valencia, y las consultas online están disponibles para cualquier lugar de España. La experiencia es igual de cercana y profesional en ambos formatos, adaptándonos a tus necesidades y preferencias.",
	},
	{
		question: "¿Cómo puedo reservar una cita?",
		answer: "Puedes reservar tu cita de forma rápida y sencilla a través de nuestro calendario online o escribiéndonos por WhatsApp. Si no sabes qué servicio necesitas, ofrecemos una primera llamada orientativa gratuita para entender tu situación y recomendarte el acompañamiento más adecuado.",
	},
	{
		question: "¿En qué momento del embarazo debo empezar la preparación al parto?",
		answer: "Lo ideal es comenzar la preparación al parto entre las semanas 28 y 32 de gestación, aunque nunca es tarde para empezar. Trabajamos la fisiología del parto, técnicas de respiración y movilidad, gestión del miedo y también preparamos el posparto para que llegues con confianza y herramientas reales.",
	},
	{
		question: "¿Cuándo debería consultar a una matrona por problemas de lactancia?",
		answer: "Lo antes posible. Si sientes dolor al amamantar, tienes grietas, tu bebé no gana peso o simplemente tienes dudas, una consulta temprana puede marcar la diferencia. También acompañamos en el destete, el banco de leche y la lactancia mixta. No tienes que pasar por esto sola.",
	},
	{
		question: "¿La menopausia también la trata una matrona?",
		answer: "Sí. Las matronas estamos formadas para acompañar a la mujer en todas sus etapas, incluida la menopausia. En Femm tribu trabajamos la gestión de síntomas, salud sexual, suelo pélvico, nutrición y hábitos saludables para que vivas esta etapa con bienestar y sin tabúes.",
	},
]
