// Domain Types
export type { Video, VideoError, VideoResult, VideoListOptions } from "./domain/video.types"

// Provider Interface (Port)
export type { VideoProvider } from "./domain/ports/video-provider.port"

// Public API (from DI Container)
export {
	getVideoProvider,
	injectVideoProvider,
	resetVideoProvider,
	getVideo,
	listVideos,
} from "./infrastructure/container"

export { MockVideoProvider } from "./providers/mock/mock.provider"
