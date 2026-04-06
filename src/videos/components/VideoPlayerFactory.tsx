"use client"

import type { VideoProviderType } from "../domain/video.types"
import { BunnyPlayer } from "./BunnyPlayer"
import { VideoPlayer } from "./VideoPlayer"

/**
 * VideoPlayerFactory - Factory component that renders the appropriate player
 * based on the video provider
 *
 * @example
 * ```tsx
 * <VideoPlayerFactory
 *   provider="bunny"
 *   url="https://player.mediadelivery.net/embed/12345/abc-def"
 *   title="My Video"
 * />
 * ```
 */
interface VideoPlayerFactoryProps {
	provider: VideoProviderType
	url: string
	title?: string
}

export const VideoPlayerFactory = ({ provider, url, title }: VideoPlayerFactoryProps) => {
	switch (provider) {
		case "bunny":
			return <BunnyPlayer url={url} title={title} />

		case "mock":
		case "cloudflare":
		default:
			// Use custom VideoPlayer for mock and cloudflare (or as fallback)
			return <VideoPlayer src={url} />
	}
}
