import type { Event } from "../../domain/event.types"

export const mockEvents: Event[] = [
	// ── General events ──────────────────────────────────────────────────────────
	{
		kind: "general",
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
		price: "30.25€ (IVA incluido)",
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
				},
			},
			{
				name: "María Belenguer",
				role: "Matrona y profesora de Barre",
				bio: "Matrona especializada en salud femenina y apasionada del movimiento consciente. Creadora de Femm tribu.",
				image: "/images/about-me/mery-portait.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/femm.tribu/",
					linkedin: "https://www.linkedin.com/in/mar%C3%ADa-belenguer-p%C3%A9rez-b966593a0/",
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
		gallery: [
			{
				id: "pelvic-glow-1",
				src: "/images/events/pelvic-glow/pelvic-glow-1.jpeg",
				alt: "Pelvic Glow Experience",
			},
			{
				id: "pelvic-glow-2",
				src: "/images/events/pelvic-glow/pelvic-glow-2.jpeg",
				alt: "Pelvic Glow - Taller",
			},
			{
				id: "pelvic-glow-3",
				src: "/images/events/pelvic-glow/pelvic-glow-3.jpeg",
				alt: "Pelvic Glow - Taller",
			},
			{
				id: "pelvic-glow-4",
				src: "/images/events/pelvic-glow/pelvic-glow-4.jpeg",
				alt: "Pelvic Glow - Taller",
			},
			{
				id: "pelvic-glow-5",
				src: "/images/events/pelvic-glow/pelvic-glow-5.jpeg",
				alt: "Pelvic Glow - Taller",
			},
		],
		whatsappNumber: "34640912048",
		seo: {
			title: "The Pelvic Glow Experience Valencia - Taller de Suelo Pélvico | 27 Marzo 2026",
			description:
				"Taller presencial de suelo pélvico y fisiosexología en Valencia. Charla con Paula Tejedo, fisioterapeuta especializada, merienda y clase de barre. Solo 15 plazas. ¡Reserva ahora!",
		},
	},
	{
		kind: "general",
		slug: "taller-ciclo-menstrual-entrenamiento-abril-2026",
		title: "Taller de Ciclo Menstrual y Entrenamiento + Clase de Barre",
		subtitle: "Taller + Almuerzo + Clase de Barre",
		date: "18 de Abril 2026",
		dateISO: "2026-04-18",
		time: "10:30h",
		startTime: "10:30:00",
		endTime: "13:00:00",
		duration: "2,5 horas aproximadamente",
		type: "Presencial",
		location: "The Sanctuary | Holistic Fitness Studio",
		locationAddress: "Carrer de Martí, 17, L'Eixample, 46005 València, Valencia",
		price: "45€ (IVA incluido)",
		spots: 8,
		description:
			"Exploraremos cómo funciona el ciclo menstrual, qué ocurre en cada una de sus fases y cómo adaptar el ejercicio a los cambios hormonales para entrenar con más energía, respeto y bienestar. Después del taller disfrutaremos de un almuerzo juntas y cerraremos la mañana con una clase de barre, una práctica de movimiento consciente que nos permitirá integrar lo aprendido.",
		whatYouWillLearn: [
			"Cómo funciona el ciclo menstrual y sus fases",
			"Qué ocurre en cada fase a nivel hormonal",
			"Cómo adaptar el ejercicio a los cambios hormonales",
			"Entrenar con más energía, respeto y bienestar",
		],
		schedule: [
			{
				time: "10:30h",
				activity: "Taller de Ciclo Menstrual y Entrenamiento",
				description:
					"Exploraremos cómo funciona el ciclo menstrual, qué ocurre en cada una de sus fases y cómo adaptar el ejercicio a los cambios hormonales.",
			},
			{
				time: "11:30h",
				activity: "Almuerzo Juntas",
				description:
					"Un momento para compartir, conocernos y crear comunidad en un ambiente relajado y acogedor.",
			},
			{
				time: "12:00h",
				activity: "Clase de Barre",
				description:
					"Una práctica de movimiento consciente que nos permitirá integrar lo aprendido mientras conectamos con nuestro cuerpo.",
			},
		],
		facilitators: [
			{
				name: "María Belenguer",
				role: "Matrona y profesora de Barre",
				bio: "Matrona especializada en salud femenina y apasionada del movimiento consciente. Creadora de Femm tribu.",
				image: "/images/about-me/mery-portait.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/femm.tribu/",
					linkedin: "https://www.linkedin.com/in/mar%C3%ADa-belenguer-p%C3%A9rez-b966593a0/",
				},
			},
		],
		includes: ["Taller de ciclo menstrual y entrenamiento", "Almuerzo", "Clase de barre", "Regalo"],
		image: "/images/events/maria-exercise.webp",
		video: {
			directusId: "5b01dfc2-27bf-48f2-95cf-10b3e12c08ef",
			alt: "Taller de Ciclo Menstrual y Entrenamiento",
		},
		whatsappNumber: "34640912048",
		seo: {
			title: "Taller Ciclo Menstrual y Entrenamiento + Barre en Valencia | 18 Abril 2026",
			description:
				"Taller presencial en Valencia sobre ciclo menstrual y entrenamiento. Aprende a adaptar el ejercicio a tus fases hormonales, disfruta de un almuerzo y una clase de barre en The Sanctuary. Contacta por WhatsApp.",
		},
	},
	{
		kind: "general",
		slug: "curso-preparacion-parto-abril-mayo-2026",
		title: "Curso de Preparación al Parto",
		subtitle: "Abril en Pausa · Salud Presencial en Valencia",
		date: "17 Abr - 15 May 2026",
		dateISO: "2026-04-17",
		sessions: [
			{ date: "17 de Abril 2026", dateISO: "2026-04-17" },
			{ date: "24 de Abril 2026", dateISO: "2026-04-24" },
			{ date: "8 de Mayo 2026", dateISO: "2026-05-08" },
			{ date: "15 de Mayo 2026", dateISO: "2026-05-15" },
		],
		time: "A confirmar",
		startTime: "10:00:00",
		endTime: "12:30:00",
		duration: "2–3 horas por sesión (4 sesiones)",
		type: "Presencial",
		location: "Valencia",
		price: "A consultar",
		spots: 8,
		description:
			"Un espacio para acompañarte con calma, información y confianza en el camino hacia el nacimiento de tu bebé. Durante cuatro sesiones semanales de 2–3 horas, trabajaremos junto a las mujeres y sus parejas para comprender la fisiología del parto, qué ocurrirá en el cuerpo durante ese día y cómo transitar también las semanas previas, el postparto y el inicio de la lactancia. Además de la parte teórica, realizaremos dinámicas en pareja para aprender a acompañar el parto desde el rol del acompañante, meditaciones y visualizaciones que ayuden a conectar con el proceso. Será también un espacio para compartir, crear grupo y llegar al parto con más seguridad, herramientas y confianza.",
		whatYouWillLearn: [
			"Fisiología del parto y qué ocurre en el cuerpo",
			"Cómo transitar las semanas previas al parto",
			"Postparto e inicio de la lactancia",
			"Dinámicas para acompañantes: cómo apoyar desde el rol de pareja",
			"Meditaciones y visualizaciones para conectar con el proceso",
			"Crear comunidad y llegar al parto con más seguridad y confianza",
		],
		schedule: [
			{
				time: "Sesión 1 · 17 Abr",
				activity: "Fisiología del parto y las semanas previas",
				description:
					"Comprenderemos qué ocurre en el cuerpo durante el parto y cómo prepararse para las semanas previas.",
			},
			{
				time: "Sesión 2 · 24 Abr",
				activity: "El parto: etapas y acompañamiento",
				description:
					"Dinámicas en pareja para aprender a acompañar el parto desde el rol del acompañante.",
			},
			{
				time: "Sesión 3 · 8 May",
				activity: "Postparto e inicio de la lactancia",
				description:
					"Todo lo que ocurre después del nacimiento: recuperación, vínculo y primeros días de lactancia.",
			},
			{
				time: "Sesión 4 · 15 May",
				activity: "Meditaciones, visualizaciones y cierre",
				description:
					"Integración de todo lo aprendido a través de meditaciones y visualizaciones. Espacio de compartir y cierre grupal.",
			},
		],
		facilitators: [
			{
				name: "María Belenguer",
				role: "Matrona",
				bio: "Matrona especializada en salud femenina y en el acompañamiento del embarazo, parto y postparto. Creadora de Femm tribu.",
				image: "/images/about-me/mery-portait.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/femm.tribu/",
					linkedin: "https://www.linkedin.com/in/mar%C3%ADa-belenguer-p%C3%A9rez-b966593a0/",
				},
			},
		],
		includes: [
			"4 sesiones presenciales de 2–3 horas",
			"Parte teórica sobre fisiología del parto",
			"Dinámicas en pareja para el acompañamiento",
			"Meditaciones y visualizaciones",
			"Material didáctico",
			"Espacio de comunidad y acompañamiento grupal",
		],
		image: "/images/about-me/mery-portait.webp",
		whatsappNumber: "34640912048",
		seo: {
			title: "Curso Preparación al Parto en Valencia · Abril en Pausa | Femm tribu",
			description:
				"Curso presencial de preparación al parto en Valencia. 4 sesiones semanales (17 y 24 Abr, 8 y 15 May 2026) con María Belenguer, matrona. Aprende sobre fisiología del parto, postparto y lactancia. Plazas limitadas.",
		},
	},

	{
		kind: "general",
		slug: "pelvic-glow-experience-ii-mayo-2026",
		title: "The Pelvic Glow Experience 2.0 · Día de la Madre",
		subtitle: "Charla Hormonal + Pilates de Suelo Pélvico + Brunch",
		date: "9 de Mayo 2026",
		dateISO: "2026-05-09",
		time: "10:30h",
		startTime: "10:30:00",
		endTime: "13:30:00",
		duration: "3 horas",
		type: "Presencial",
		location: "Valencia",
		locationAddress: "Calle Convent dels Carmelites, 5, Valencia",
		price: "30€ (IVA incluido)",
		spots: 15,
		description:
			"Una experiencia diseñada para mujeres que deseen comprender su ciclo, cuidar su suelo pélvico y abrazar cada etapa —desde la menstruación hasta la menopausia— con conocimiento y placer. Un plan perfecto para regalar(te) en el Día de la Madre o para venir con esa mujer especial con la que quieres compartir autocuidado y consciencia.\n\nHaremos primero una charla sobre salud hormonal, ciclo menstrual y menopausia: un espacio divulgativo y cercano donde entenderás cómo funcionan tus hormonas y qué puedes hacer para acompañar cada etapa con herramientas prácticas. Después, una sesión de pilates enfocado a suelo pélvico y core profundo, con movimiento consciente para activar, fortalecer y liberar la zona abdominopélvica. Terminaremos con un brunch para compartir, nutrirnos y crear comunidad entre nosotras. Y además… ¡habrá sorpresas!",
		whatYouWillLearn: [
			"Cómo funcionan tus hormonas a lo largo del ciclo menstrual",
			"Herramientas prácticas para acompañar la menopausia",
			"Cómo activar, fortalecer y liberar el suelo pélvico y el core profundo",
			"Movimiento consciente para reconectar con tu cuerpo",
		],
		facilitators: [
			{
				name: "Paula Tejedo",
				role: "Fisioterapeuta especializada en suelo pélvico y profesora de pilates",
				bio: "Experta en salud pélvica femenina y fisiosexología, Paula acompaña a mujeres en el cuidado de su cuerpo desde una mirada integradora y respetuosa.",
				image: "/images/about-me/paula-tejedo.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/paula.fisiosuelopelvico/",
				},
			},
			{
				name: "María Belenguer",
				role: "Matrona y profesora de Barre",
				bio: "Matrona especializada en salud femenina y apasionada del movimiento consciente. Creadora de Femm tribu.",
				image: "/images/about-me/mery-portait.webp",
				socialMedia: {
					instagram: "https://www.instagram.com/femm.tribu/",
					linkedin: "https://www.linkedin.com/in/mar%C3%ADa-belenguer-p%C3%A9rez-b966593a0/",
				},
			},
		],
		includes: [
			"Charla sobre salud hormonal, ciclo menstrual y menopausia",
			"Sesión de pilates de suelo pélvico y core profundo",
			"Brunch compartido",
			"Sorpresas",
		],
		image: "/images/events/pelvic-glow-2/portada.webp",
		gallery: [
			{
				id: "pelvic-glow-2",
				src: "/images/events/pelvic-glow-2/img-4.webp",
				alt: "Pelvic Glow - Taller",
			},
			{
				id: "pelvic-glow-3",
				src: "/images/events/pelvic-glow-2/img-1.webp",
				alt: "Pelvic Glow - Instructoras",
			},
			{
				id: "pelvic-glow-4",
				src: "/images/events/pelvic-glow-2/img-2.webp",
				alt: "Pelvic Glow - Instructoras",
			},
			{
				id: "pelvic-glow-5",
				src: "/images/events/pelvic-glow-2/img-3.webp",
				alt: "Pelvic Glow - Instructoras",
			},
			{
				id: "pelvic-glow-1",
				src: "/images/events/pelvic-glow-2/portada.webp",
				alt: "Pelvic Glow Experience",
			},
		],
		whatsappNumber: "34640912048",
		seo: {
			title: "The Pelvic Glow Experience 2.0 · Día de la Madre Valencia | 9 Mayo 2026",
			description:
				"Taller presencial en Valencia para el Día de la Madre. Charla de salud hormonal y menopausia, pilates de suelo pélvico y brunch compartido. Con María Belenguer, matrona. ¡Reserva tu plaza!",
		},
	},

	// ── Club de Lectura events ───────────────────────────────────────────────────
	{
		kind: "club-lectura",
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
