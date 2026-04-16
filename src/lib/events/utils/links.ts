import type { ClubLecturaEvent, Event, GeneralEvent } from "../domain/event.types"
import { isClubLecturaEvent } from "../domain/event.types"

function getEventUrl(event: Event, websiteUrl: string): string {
	return isClubLecturaEvent(event)
		? `${websiteUrl}/eventos/club-lectura/${event.slug}`
		: `${websiteUrl}/eventos/${event.slug}`
}

export function generateCalendarLink(event: Event, websiteUrl = "https://femmtribu.es"): string {
	const startDateTime = `${event.dateISO.replace(/-/g, "")}T${event.startTime.replace(/:/g, "")}`
	const endDateTime = `${event.dateISO.replace(/-/g, "")}T${event.endTime.replace(/:/g, "")}`
	const eventUrl = getEventUrl(event, websiteUrl)

	const eventTitle = encodeURIComponent(event.title)
	const location = isClubLecturaEvent(event)
		? "Online"
		: (event as GeneralEvent).location || "Online"
	const description = isClubLecturaEvent(event)
		? `Un espacio para mujeres que quieren profundizar en su salud, su cuerpo y su historia a través de los libros. En esta edición leeremos ${(event as ClubLecturaEvent).book.title} de ${(event as ClubLecturaEvent).book.author}.\n\nMás información: ${eventUrl}`
		: `${(event as GeneralEvent).description}\n\nMás información: ${eventUrl}`

	return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
}

export function generateShareLinks(event: Event, websiteUrl = "https://femmtribu.es") {
	const eventUrl = getEventUrl(event, websiteUrl)
	const shareText = isClubLecturaEvent(event)
		? `${event.title} - ${event.subtitle}\n${event.date} a las ${event.time}\n\nÚnete a nosotras en este espacio para mujeres 📚`
		: `${event.title}\n${event.date} a las ${event.time}\n${(event as GeneralEvent).location || "Online"}\n\nÚnete a nosotras en este espacio para mujeres ✨`

	return {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + eventUrl)}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
		email: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareText + "\n\n" + eventUrl)}`,
		copyLink: eventUrl,
	}
}

export function generateWhatsAppReservationLink(event: GeneralEvent, phoneNumber: string): string {
	const message = `Hola, estoy interesada en ${event.title} del ${event.date}`
	return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
