import type { VideoProvider } from "../domain/ports/video-provider.port"
import type { Video, VideoResult } from "../domain/video.types"
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
