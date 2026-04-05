// Domain Types
export type { Video, VideoError, VideoResult } from "./domain/video.types"

// Provider Interface (Port)
export type { VideoProvider } from "./domain/ports/video-provider.port"

// Public API (from DI Container)
export {
	getVideoProvider,
	injectVideoProvider,
	resetVideoProvider,
	getVideo,
} from "./infrastructure/container"

export { MockVideoProvider } from "./providers/mock/mock.provider"
