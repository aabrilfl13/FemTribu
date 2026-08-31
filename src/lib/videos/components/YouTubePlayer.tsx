"use client"

interface YouTubePlayerProps {
	url: string
	title?: string
}

/**
 * YouTubePlayer - YouTube embed player (youtube-nocookie.com)
 * `url` must already be the embed URL, e.g. https://www.youtube-nocookie.com/embed/VIDEO_ID
 */
export const YouTubePlayer = ({ url, title }: YouTubePlayerProps) => {
	return (
		<div className="relative w-full" style={{ paddingTop: "56.25%" }}>
			<iframe
				src={url}
				loading="lazy"
				title={title || "Video player"}
				style={{
					border: 0,
					position: "absolute",
					top: 0,
					height: "100%",
					width: "100%",
				}}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
			/>
		</div>
	)
}
