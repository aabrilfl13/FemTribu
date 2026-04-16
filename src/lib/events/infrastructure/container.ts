import type { Event } from "../domain/event.types"
import type { EventProvider } from "../domain/ports/event-provider.port"
import { MockEventProvider } from "../providers/mock/mock.provider"

let _provider: EventProvider | null = null

export function getEventProvider(): EventProvider {
	if (!_provider) {
		_provider = new MockEventProvider()
	}
	return _provider
}

export async function fetchEvents(): Promise<Event[]> {
	const result = await getEventProvider().fetchAll()
	return result.data ?? []
}

export async function fetchEvent(slug: string): Promise<Event | undefined> {
	const result = await getEventProvider().fetchBySlug(slug)
	return result.data ?? undefined
}
