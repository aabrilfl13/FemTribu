import type { VideoProvider } from "../../domain/ports/video-provider.port"
import type { Video, VideoListOptions, VideoResult } from "../../domain/video.types"
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

	async listVideos(options?: VideoListOptions): Promise<VideoResult<Video[]>> {
		let filteredVideos = [...this.videos]

		// Filter by courseId
		if (options?.courseId) {
			filteredVideos = filteredVideos.filter((v) => v.courseId === options.courseId)
		}

		// Filter by status
		if (options?.status) {
			filteredVideos = filteredVideos.filter((v) => v.status === options.status)
		}

		// Filter by date range
		if (options?.from_date) {
			filteredVideos = filteredVideos.filter((v) => v.createdAt >= options.from_date!)
		}

		if (options?.to_date) {
			filteredVideos = filteredVideos.filter((v) => v.createdAt <= options.to_date!)
		}

		// Sort by chapter index (then by creation date)
		filteredVideos.sort((a, b) => {
			if (a.chapterIndex !== null && b.chapterIndex !== null) {
				return a.chapterIndex - b.chapterIndex
			}
			return a.createdAt.getTime() - b.createdAt.getTime()
		})

		// Apply pagination
		const offset = options?.offset || 0
		const limit = options?.limit !== undefined ? options.limit : filteredVideos.length
		const paginatedVideos = filteredVideos.slice(offset, offset + limit)

		return {
			data: paginatedVideos,
			error: null,
		}
	}
}
