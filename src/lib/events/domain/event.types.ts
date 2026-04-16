export interface BaseEvent {
	slug: string
	title: string
	subtitle: string
	date: string // Format: "27 de Marzo 2026" or range "17 Abr - 15 May 2026"
	dateISO: string // First session ISO date: "2026-03-27"
	time: string // Display time: "18:00h" or "A confirmar"
	startTime: string // "18:00:00" (HH:mm:ss)
	endTime: string // "21:00:00" (HH:mm:ss)
	duration: string
	sessions?: { date: string; dateISO: string }[]
	seo: {
		title: string
		description: string
	}
}

export interface GeneralEvent extends BaseEvent {
	kind: "general"
	type: "Presencial" | "Online" | "Híbrido"
	location?: string
	locationAddress?: string
	price: string
	spots: number
	description: string
	whatYouWillLearn?: string[]
	schedule?: {
		time: string
		activity: string
		description?: string
	}[]
	facilitators?: {
		name: string
		role: string
		bio: string
		image?: string
		socialMedia?: {
			instagram?: string
			linkedin?: string
			website?: string
		}
	}[]
	includes?: string[]
	image: string
	gallery?: { id: string; src: string; alt: string }[]
	video?: {
		directusId: string
		alt?: string
	}
	whatsappNumber: string
}

export interface ClubLecturaEvent extends BaseEvent {
	kind: "club-lectura"
	book: {
		title: string
		author: string
		coverImage: string
		description: string
		topics: string[]
	}
	whatsappLink: string
}

export type Event = GeneralEvent | ClubLecturaEvent

// Type guards
export function isGeneralEvent(event: Event): event is GeneralEvent {
	return event.kind === "general"
}

export function isClubLecturaEvent(event: Event): event is ClubLecturaEvent {
	return event.kind === "club-lectura"
}

export interface EventError {
	message: string
	code: string
}

export interface EventResult<T = void> {
	data: T | null
	error: EventError | null
}
