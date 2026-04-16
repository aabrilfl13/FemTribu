import type { Event, EventResult } from "../../domain/event.types"
import type { EventProvider } from "../../domain/ports/event-provider.port"
import { mockEvents } from "./mock-events.data"

export class MockEventProvider implements EventProvider {
	private events: Event[] = mockEvents

	async fetchAll(): Promise<EventResult<Event[]>> {
		return { data: this.events, error: null }
	}

	async fetchBySlug(slug: string): Promise<EventResult<Event | undefined>> {
		const event = this.events.find((e) => e.slug === slug)
		return { data: event, error: null }
	}
}
