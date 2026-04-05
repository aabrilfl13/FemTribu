export interface Video {
	id: string
	title: string
	description: string | null
	duration: number // seconds
	thumbnailUrl: string
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
