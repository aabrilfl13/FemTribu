// Domain Types
export type {
	Event,
	BaseEvent,
	GeneralEvent,
	ClubLecturaEvent,
	EventError,
	EventResult,
} from "./domain/event.types"

// Type Guards
export { isGeneralEvent, isClubLecturaEvent } from "./domain/event.types"

// Provider Interface (Port)
export type { EventProvider } from "./domain/ports/event-provider.port"

// Public API (from DI Container)
export { getEventProvider, fetchEvents, fetchEvent } from "./infrastructure/container"

// Providers
export { MockEventProvider } from "./providers/mock/mock.provider"

// Mock Data (for testing and development)
export { mockEvents } from "./providers/mock/mock-events.data"

// Utilities
export {
	generateCalendarLink,
	generateShareLinks,
	generateWhatsAppReservationLink,
} from "./utils/links"
