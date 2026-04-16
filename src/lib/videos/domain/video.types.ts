export type VideoProviderType = "bunny" | "cloudflare" | "mock"

export interface Video {
	id: string
	title: string
	description: string | null
	duration: number // seconds
	thumbnailUrl: string
	url: string
	provider: VideoProviderType // Which provider this video comes from
	courseId: string | null
	chapterIndex: number | null
	metadata: Record<string, any>
	createdAt: Date
	status: "ready" | "processing" | "error"
}

export interface VideoError {
	message: string
	code: string
}

export interface VideoResult<T = void> {
	data: T | null
	error: VideoError | null
}

export interface VideoListOptions {
	courseId?: string
	status?: Video["status"]
	from_date?: Date // Filter videos created on or after this date
	to_date?: Date // Filter videos created on or before this date
	limit?: number
	offset?: number
}
