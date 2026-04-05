import type { Video, VideoResult } from "../video.types"

export interface VideoProvider {
	/**
	 * Get video metadata by ID
	 */
	getVideo(videoId: string): Promise<VideoResult<Video>>
}
