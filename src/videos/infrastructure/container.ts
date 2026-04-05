import type { VideoProvider } from "../domain/ports/video-provider.port"
import type { Video, VideoListOptions, VideoResult } from "../domain/video.types"
import { CloudflareStreamProvider } from "../providers/cloudflare/cloudflare-stream.provider"
import { MockVideoProvider } from "../providers/mock/mock.provider"

/**
 * Module-level provider instance (lazy initialized)
 */
let _provider: VideoProvider | null = null

/**
 * Get the video provider (lazy initialization)
 * Reads VIDEOS_PROVIDER env var to decide which provider to instantiate
 *
 * @example
 * const provider = getVideoProvider()
 * const video = await provider.getVideo('video-id')
 */
export function getVideoProvider(): VideoProvider {
	if (!_provider) {
		const providerType = import.meta.env.VIDEOS_PROVIDER?.toLowerCase()

		if (providerType === "cloudflare") {
			_provider = new CloudflareStreamProvider()
		} else {
			// Default to mock
			_provider = new MockVideoProvider()
		}
	}

	return _provider
}

/**
 * Override the provider (for testing)
 *
 * @example
 * // In tests
 * import { injectVideoProvider, MockVideoProvider } from '@/videos'
 * injectVideoProvider(new MockVideoProvider())
 */
export function injectVideoProvider(provider: VideoProvider): void {
	_provider = provider
}

/**
 * Reset the provider to null (for testing)
 * Next call to getVideoProvider() will re-initialize from env var
 *
 * @example
 * // In test cleanup
 * afterEach(() => {
 *   resetVideoProvider()
 * })
 */
export function resetVideoProvider(): void {
	_provider = null
}

/**
 * Get video metadata by ID
 * Convenience function that uses the active provider
 *
 * @param videoId - The video identifier
 */
export function getVideo(videoId: string): Promise<VideoResult<Video>> {
	return getVideoProvider().getVideo(videoId)
}

/**
 * List videos with optional filtering
 * Supports filtering by courseId, status, date range, and pagination
 *
 * @param options - Filter options (courseId, status, from_date, to_date, limit, offset)
 * @example
 * // Get all videos for a course
 * listVideos({ courseId: "femmbarre-intro" })
 *
 * // Get videos from January 2024
 * listVideos({
 *   from_date: new Date("2024-01-01"),
 *   to_date: new Date("2024-01-31")
 * })
 *
 * // Get videos from the last 30 days
 * const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
 * listVideos({ from_date: thirtyDaysAgo })
 *
 * // Get ready videos with pagination
 * listVideos({ status: "ready", limit: 10, offset: 0 })
 */
export function listVideos(options?: VideoListOptions): Promise<VideoResult<Video[]>> {
	return getVideoProvider().listVideos(options)
}
