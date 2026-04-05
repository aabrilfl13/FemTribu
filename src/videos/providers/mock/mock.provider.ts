import type { VideoProvider } from "../../domain/ports/video-provider.port"
import type { Video, VideoResult } from "../../domain/video.types"
import { mockVideos } from "./mock-videos.data"

/**
 * Mock video provider for local development
 * Simulates Cloudflare Stream API without requiring credentials
 *
 * @example
 * // In video-service.ts
 * let provider = new MockVideoProvider()
 */
export class MockVideoProvider implements VideoProvider {
	private videos: Video[] = mockVideos

	constructor() {
		console.log("[MockVideoProvider] Initialized - Using mock video data for development")
	}

	async getVideo(videoId: string): Promise<VideoResult<Video>> {
		const video = this.videos.find((v) => v.id === videoId)

		if (!video) {
			return {
				data: null,
				error: {
					message: `Video con ID "${videoId}" no encontrado`,
					code: "video_not_found",
				},
			}
		}

		return {
			data: video,
			error: null,
		}
	}
}
