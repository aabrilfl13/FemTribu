import type { Video } from "../../domain/video.types"

/**
 * Mock video data for local development
 * Add your own test videos here
 */
export const mockVideos: Video[] = [
	// FemmBarre Maternity course
	{
		id: "maternity-video-1",
		title: "Bienvenida al programa",
		description:
			"Introducción al programa FemmBarre Maternity. Conoce los beneficios, adaptaciones y qué esperar de cada clase.",
		duration: 900, // 15 minutes
		thumbnailUrl: "https://placehold.co/1280x720/B85440/ffffff?text=Bienvenida",
		url: "/FEMM-BARRE-MATERNITY-01.mp4",
		courseId: "femmbarre-maternity",
		chapterIndex: 1,
		metadata: {
			instructor: "María Belenguer",
		},
		createdAt: new Date("2026-03-01"),
		status: "ready",
	},
	{
		id: "maternity-video-2",
		title: "Clase completa - Primer trimestre",
		description:
			"Clase de 45 minutos adaptada al primer trimestre. Enfoque en movilidad, respiración y conexión con tu cuerpo.",
		duration: 2700, // 45 minutes
		thumbnailUrl: "https://placehold.co/1280x720/B85440/ffffff?text=1er+Trimestre",
		url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
		courseId: "femmbarre-maternity",
		chapterIndex: 2,
		metadata: {
			instructor: "María Belenguer",
		},
		createdAt: new Date("2026-03-08"),
		status: "ready",
	},
	{
		id: "maternity-video-3",
		title: "Clase completa - Segundo trimestre",
		description:
			"Sesión de 50 minutos para el segundo trimestre. Fortalecimiento de espalda, piernas y preparación pélvica.",
		duration: 3000, // 50 minutes
		thumbnailUrl: "https://placehold.co/1280x720/B85440/ffffff?text=2do+Trimestre",
		url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
		courseId: "femmbarre-maternity",
		chapterIndex: 3,
		metadata: {
			instructor: "María Belenguer",
		},
		createdAt: new Date("2026-03-15"),
		status: "ready",
	},
	{
		id: "maternity-video-4",
		title: "Clase completa - Tercer trimestre",
		description:
			"Clase de 45 minutos para el tercer trimestre. Movimientos suaves, movilidad pélvica y preparación al parto.",
		duration: 2700, // 45 minutes
		thumbnailUrl: "https://placehold.co/1280x720/B85440/ffffff?text=3er+Trimestre",
		url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
		courseId: "femmbarre-maternity",
		chapterIndex: 4,
		metadata: {
			instructor: "María Belenguer",
		},
		createdAt: new Date("2026-03-22"),
		status: "ready",
	},
	{
		id: "maternity-video-5",
		title: "Ejercicios de suelo pélvico",
		description:
			"Rutina específica de 20 minutos para fortalecer y conectar con tu suelo pélvico durante el embarazo.",
		duration: 1200, // 20 minutes
		thumbnailUrl: "https://placehold.co/1280x720/7A9582/ffffff?text=Suelo+Pelvico",
		url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
		courseId: "femmbarre-maternity",
		chapterIndex: 5,
		metadata: {
			instructor: "María Belenguer",
		},
		createdAt: new Date("2026-03-29"),
		status: "ready",
	},
	{
		id: "maternity-video-6",
		title: "Movilidad y preparación al parto",
		description:
			"Sesión de 30 minutos enfocada en movimientos de movilidad pélvica que te ayudarán en el momento del parto.",
		duration: 1800, // 30 minutes
		thumbnailUrl: "https://placehold.co/1280x720/7A9582/ffffff?text=Movilidad",
		url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
		courseId: "femmbarre-maternity",
		chapterIndex: 6,
		metadata: {
			instructor: "María Belenguer",
		},
		createdAt: new Date("2026-04-05"),
		status: "ready",
	},
]

/**
 * Sample video URLs for testing
 * These are publicly available test videos
 */
export const SAMPLE_VIDEO_URLS = {
	// Big Buck Bunny (open source test video)
	hls: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
	mp4: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",

	// Sintel (another open source test video)
	sintel_hls: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",

	// Tears of Steel (Blender open movie)
	tears_mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
}
