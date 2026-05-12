"use client"

import { useEffect, useRef } from "react"

interface TrackingContext {
	courseId: string
	videoId: string
	videoTitle?: string
}

interface BunnyPlayerProps {
	url: string
	title?: string
	trackingContext?: TrackingContext
}

interface PlayerJsMessage {
	event?: string
	method?: string
	value?: unknown
	listener?: string
	context?: string
}

/**
 * BunnyPlayer - Bunny.net Stream embed player
 * Uses Bunny's native player via iframe embed.
 *
 * Tracking: uses Player.js postMessage protocol (Bunny implements it natively)
 * to capture play / timeupdate / ended and forward GA4 events when a
 * trackingContext is provided.
 */
export const BunnyPlayer = ({ url, title, trackingContext }: BunnyPlayerProps) => {
	const iframeRef = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		if (!trackingContext) return
		const iframe = iframeRef.current
		if (!iframe) return

		const progressMilestones = new Set<number>()
		let hasStarted = false
		let hasCompleted = false

		const fire = (name: string, extra: Record<string, string | number> = {}) => {
			const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
			if (typeof gtag !== "function") return
			gtag("event", name, {
				course_id: trackingContext.courseId,
				video_id: trackingContext.videoId,
				video_title: trackingContext.videoTitle,
				provider: "bunny",
				...extra,
			})
		}

		const post = (method: string, value?: string) => {
			iframe.contentWindow?.postMessage(
				JSON.stringify({ context: "player.js", method, value }),
				"*"
			)
		}

		const onMessage = (e: MessageEvent) => {
			if (e.source !== iframe.contentWindow) return
			let data: PlayerJsMessage
			try {
				data = typeof e.data === "string" ? JSON.parse(e.data) : (e.data as PlayerJsMessage)
			} catch {
				return
			}
			if (data?.context !== "player.js") return

			if (data.event === "ready") {
				for (const evt of ["play", "timeupdate", "ended"]) {
					post("addEventListener", evt)
				}
				return
			}

			if (data.event === "play" && !hasStarted) {
				hasStarted = true
				fire("video_start")
				return
			}

			if (data.event === "timeupdate") {
				const payload = data.value as { seconds?: number; duration?: number } | undefined
				const seconds = payload?.seconds ?? 0
				const duration = payload?.duration ?? 0
				if (!duration) return
				const pct = (seconds / duration) * 100

				for (const milestone of [25, 50, 75]) {
					if (pct >= milestone && !progressMilestones.has(milestone)) {
						progressMilestones.add(milestone)
						fire("video_progress", { percent: milestone })
					}
				}

				if (!hasCompleted && pct >= 90) {
					hasCompleted = true
					fire("video_complete")
				}
				return
			}

			if (data.event === "ended" && !hasCompleted) {
				hasCompleted = true
				fire("video_complete")
			}
		}

		window.addEventListener("message", onMessage)

		// If the iframe already loaded (cached), Bunny won't send "ready" again —
		// ping it to get the current state.
		const fallbackTimer = window.setTimeout(() => {
			for (const evt of ["play", "timeupdate", "ended"]) {
				post("addEventListener", evt)
			}
		}, 1500)

		return () => {
			window.removeEventListener("message", onMessage)
			window.clearTimeout(fallbackTimer)
		}
	}, [trackingContext])

	return (
		<div className="relative w-full" style={{ paddingTop: "56.25%" }}>
			<iframe
				ref={iframeRef}
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
