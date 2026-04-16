"use client"

/**
 * BunnyPlayer - Bunny.net Stream embed player
 * Uses Bunny's native player via iframe embed
 *
 * @param url - The Bunny embed URL (e.g., https://player.mediadelivery.net/embed/{libraryId}/{videoGuid})
 */
interface BunnyPlayerProps {
	url: string
	title?: string
}

export const BunnyPlayer = ({ url, title }: BunnyPlayerProps) => {
	return (
		<div className="relative w-full" style={{ paddingTop: "56.25%" }}>
			<iframe
				src={`${url}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
				loading="lazy"
				title={title || "Video player"}
				style={{
					border: 0,
					position: "absolute",
					top: 0,
					height: "100%",
					width: "100%",
				}}
				allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
				allowFullScreen
			/>
		</div>
	)
}
