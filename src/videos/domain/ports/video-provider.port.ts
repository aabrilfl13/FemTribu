import type { Video, VideoListOptions, VideoResult } from "../video.types"

export interface VideoProvider {
	/**
	 * Get video metadata by ID
	 */
	getVideo(videoId: string): Promise<VideoResult<Video>>

	/**
	 * List videos with optional filtering
	 */
	listVideos(options?: VideoListOptions): Promise<VideoResult<Video[]>>
}
