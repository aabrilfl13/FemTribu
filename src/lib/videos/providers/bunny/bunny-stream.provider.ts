import type { VideoProvider } from "../../domain/ports/video-provider.port"
import type { Video, VideoListOptions, VideoResult } from "../../domain/video.types"
import type { BunnyStreamConfig, BunnyVideoResponse, BunnyVideosListResponse } from "./types"

/**
 * Bunny Stream provider for video streaming
 * Connects to Bunny.net Stream API
 *
 * @example
 * // With default library from env
 * const provider = new BunnyStreamProvider()
 *
 * @example
 * // With custom configuration
 * const provider = new BunnyStreamProvider({
 *   libraryId: '12345',
 *   apiKey: 'your-api-key',
 *   cdnHostname: 'custom.hostname.net'
 * })
 */
export class BunnyStreamProvider implements VideoProvider {
	private libraryId: string
	private apiKey: string
	private cdnHostname: string

	constructor(config?: BunnyStreamConfig) {
		// If config provided, use it; otherwise read from env
		if (config) {
			this.libraryId = config.libraryId
			this.apiKey = config.apiKey
			this.cdnHostname = config.cdnHostname
		} else {
			this.libraryId = import.meta.env.BUNNY_STREAM_LIBRARY_ID
			this.apiKey = import.meta.env.BUNNY_STREAM_API_KEY
			this.cdnHostname = import.meta.env.BUNNY_STREAM_CDN_HOSTNAME
		}
		if (!this.apiKey) {
			throw new Error(
				"BunnyStreamProvider requires apiKey (via config or BUNNY_STREAM_API_KEY env var)"
			)
		}

		console.log("[BunnyStreamProvider] Initialized - Connected to Bunny Stream API")
		if (this.libraryId) {
			console.log(`[BunnyStreamProvider] Library ID: ${this.libraryId}`)
		} else {
			console.log(
				"[BunnyStreamProvider] No default library - videos must use format 'libraryId:videoGuid'"
			)
		}
	}

	/**
	 * Parse video ID in format "libraryId:videoGuid"
	 * Returns { libraryId, videoGuid }
	 */
	private parseVideoId(videoId: string): { libraryId: string; videoGuid: string } {
		const parts = videoId.split(":")
		if (parts.length === 2) {
			return { libraryId: parts[0], videoGuid: parts[1] }
		}
		// If no colon, assume it's just a GUID and use default library
		if (this.libraryId) {
			return { libraryId: this.libraryId, videoGuid: videoId }
		}
		throw new Error(
			`Video ID must be in format 'libraryId:videoGuid' or configure a default library. Got: ${videoId}`
		)
	}

	/**
	 * Encode video ID as "libraryId:videoGuid"
	 */
	private encodeVideoId(libraryId: string, videoGuid: string): string {
		return `${libraryId}:${videoGuid}`
	}

	/**
	 * Get video metadata by ID
	 * Video ID format: "libraryId:videoGuid" or just "videoGuid" (uses default library)
	 *
	 * @example
	 * // With explicit library
	 * getVideo("12345:abc-def-ghi")
	 *
	 * // With default library
	 * getVideo("abc-def-ghi")
	 */
	async getVideo(videoId: string): Promise<VideoResult<Video>> {
		try {
			const { libraryId, videoGuid } = this.parseVideoId(videoId)

			const response = await fetch(
				`https://video.bunnycdn.com/library/${libraryId}/videos/${videoGuid}`,
				{
					headers: {
						Accept: "application/json",
						AccessKey: this.apiKey,
					},
				}
			)

			if (!response.ok) {
				if (response.status === 404) {
					return {
						data: null,
						error: {
							message: `Video con ID "${videoId}" no encontrado`,
							code: "video_not_found",
						},
					}
				}

				const errorText = await response.text()
				return {
					data: null,
					error: {
						message: `Error al obtener video: ${errorText}`,
						code: "bunny_api_error",
					},
				}
			}

			const bunnyVideo: BunnyVideoResponse = await response.json()
			const video = this.mapBunnyVideoToVideo(bunnyVideo, libraryId)

			return {
				data: video,
				error: null,
			}
		} catch (error) {
			return {
				data: null,
				error: {
					message: error instanceof Error ? error.message : "Error desconocido",
					code: "network_error",
				},
			}
		}
	}

	/**
	 * List videos with optional filtering
	 * Queries the configured library
	 * Supports filtering by courseId (via metaTags), status, date range, and pagination
	 */
	async listVideos(options?: VideoListOptions): Promise<VideoResult<Video[]>> {
		try {
			if (!this.libraryId) {
				return {
					data: null,
					error: {
						message: "No library configured. Set defaultLibraryId in config.",
						code: "no_library_configured",
					},
				}
			}

			// Build query parameters
			const params = new URLSearchParams()
			const page = options?.offset ? Math.floor(options.offset / (options.limit || 50)) + 1 : 1
			const perPage = options?.limit || 50
			const collectionId = options?.courseId || ""

			params.set("page", page.toString())
			params.set("itemsPerPage", perPage.toString())
			params.set("collection", collectionId)

			// Fetch from the library
			const response = await fetch(
				`https://video.bunnycdn.com/library/${this.libraryId}/videos?${params.toString()}`,
				{
					headers: {
						Accept: "application/json",
						AccessKey: this.apiKey,
					},
				}
			)

			if (!response.ok) {
				const errorText = await response.text()
				return {
					data: null,
					error: {
						message: `Error fetching videos: ${errorText}`,
						code: "bunny_api_error",
					},
				}
			}

			const bunnyResponse: BunnyVideosListResponse = await response.json()
			let videos = bunnyResponse.items.map((item) =>
				this.mapBunnyVideoToVideo(item, this.libraryId!)
			)

			// Sort by chapter index (then by creation date)
			videos.sort((a, b) => {
				if (a.chapterIndex !== null && b.chapterIndex !== null) {
					return a.chapterIndex - b.chapterIndex
				}
				return a.createdAt.getTime() - b.createdAt.getTime()
			})

			return {
				data: videos,
				error: null,
			}
		} catch (error) {
			return {
				data: null,
				error: {
					message: error instanceof Error ? error.message : "Error desconocido",
					code: "network_error",
				},
			}
		}
	}

	/**
	 * Map Bunny video response to our Video type
	 * @param bunnyVideo - Bunny API video response
	 * @param libraryId - The library ID this video belongs to
	 */
	private mapBunnyVideoToVideo(bunnyVideo: BunnyVideoResponse, libraryId: string): Video {
		// Extract metadata from metaTags
		const metaTags = bunnyVideo.metaTags || []
		const courseId = libraryId
		const chapterIndexStr = metaTags.find((tag) => tag.property === "chapterIndex")?.value
		const chapterIndex = chapterIndexStr ? parseInt(chapterIndexStr, 10) : null

		// Build CDN URL for video playback
		// TODO: check this for HLS `https://${this.cdnHostname}/embed/${libraryId}/${bunnyVideo.guid}`
		const videoUrl = `https://player.mediadelivery.net/embed/${libraryId}/${bunnyVideo.guid}`

		// Build thumbnail URL
		const thumbnailUrl = `https://${this.cdnHostname}/${bunnyVideo.guid}/${bunnyVideo.thumbnailFileName}`
		// Map Bunny status to our status
		// Bunny status: 0 = Uploaded, 1 = Processing, 2 = Encoding, 3 = Finished, 4 = Failed, 5 = Uploading
		let status: "ready" | "processing" | "error"
		if (bunnyVideo.status === 3) {
			status = "ready"
		} else if (bunnyVideo.status === 4) {
			status = "error"
		} else {
			status = "processing"
		}

		return {
			id: this.encodeVideoId(libraryId, bunnyVideo.guid),
			title: bunnyVideo.title || "Sin título",
			description: bunnyVideo.description || null,
			duration: bunnyVideo.length,
			thumbnailUrl: thumbnailUrl,
			url: videoUrl,
			provider: "bunny",
			courseId: courseId,
			chapterIndex: chapterIndex,
			metadata: {
				views: bunnyVideo.views,
				width: bunnyVideo.width,
				height: bunnyVideo.height,
				framerate: bunnyVideo.framerate,
				availableResolutions: bunnyVideo.availableResolutions,
				metaTags: bunnyVideo.metaTags,
				libraryId: libraryId,
			},
			createdAt: new Date(bunnyVideo.dateUploaded),
			status: status,
		}
	}
}
