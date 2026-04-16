// Domain Types
export type {
	Video,
	VideoError,
	VideoResult,
	VideoListOptions,
	VideoProviderType,
} from "./domain/video.types"

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

// Providers
export { MockVideoProvider } from "./providers/mock/mock.provider"
export { BunnyStreamProvider } from "./providers/bunny/bunny-stream.provider"

// Mock Data (for testing and development)
export { mockVideos, SAMPLE_VIDEO_URLS } from "./providers/mock/mock-videos.data"

// Components
export { VideoPlayerFactory } from "./components/VideoPlayerFactory"
export { VideoPlayer } from "./components/VideoPlayer"
export { BunnyPlayer } from "./components/BunnyPlayer"
