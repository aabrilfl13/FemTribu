/**
 * Bunny Stream API response for a single video
 * Full documentation: https://docs.bunny.net/reference/video_getvideo
 */
export interface BunnyVideoResponse {
	videoLibraryId: number
	guid: string
	title: string
	dateUploaded: string
	views: number
	isPublic: boolean
	length: number
	status: number // 0 = Uploaded, 1 = Processing, 2 = Encoding, 3 = Finished, 4 = Failed, 5 = Uploading
	framerate: number
	width: number
	height: number
	outputCodecs: string
	thumbnailCount: number
	encodeProgress: number
	storageSize: number
	hasMP4Fallback: boolean
	averageWatchTime: number
	totalWatchTime: number
	description: string
	rotation: number
	availableResolutions: string
	captions: Array<{
		srclang: string
		label: string
		version: number
	}>
	collectionId: string
	thumbnailFileName: string
	thumbnailBlurhash: string
	category: string
	chapters: Array<{
		title: string
		start: number
		end: number
	}>
	moments: Array<{
		label: string
		timestamp: number
	}>
	metaTags: Array<{
		property: string
		value: string
	}>
	transcodingMessages: Array<{
		timeStamp: string
		level: number
		issueCode: number
		message: string
		value: string
	}>
	jitEncodingEnabled: boolean
	smartGenerateStatus: number
	hasOriginal: boolean
	originalHash: string
	hasHighQualityPreview: boolean
}

/**
 * Bunny Stream API response for video list
 */
export interface BunnyVideosListResponse {
	totalItems: number
	currentPage: number
	itemsPerPage: number
	items: BunnyVideoResponse[]
}

export interface BunnyStreamConfig {
	/**
	 * Library ID for video storage
	 */
	libraryId: string
	/**
	 * Bunny Stream API key (required)
	 */
	apiKey: string
	/**
	 * Custom CDN hostname
	 */
	cdnHostname: string
}
