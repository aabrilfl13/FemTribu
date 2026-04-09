import type { Event, EventResult } from "../event.types"

export interface EventProvider {
	fetchAll(): Promise<EventResult<Event[]>>
	fetchBySlug(slug: string): Promise<EventResult<Event | undefined>>
}
