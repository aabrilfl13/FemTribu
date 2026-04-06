import { useEffect, useRef } from "react"

import type { Video } from "@/videos"

interface VideoGridProps {
	videos: Video[]
	courseSlug: string
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	return `${mins} min`
}

export default function VideoGrid({ videos, courseSlug }: VideoGridProps) {
	const gridRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!gridRef.current) return

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const element = entry.target as HTMLElement
						const delay = element.dataset.animateDelay || "0ms"

						element.classList.add("animate-fade-up")
						element.style.animationDelay = delay
						observer.unobserve(element)
					}
				})
			},
			{
				root: null,
				rootMargin: "0px 0px -100px 0px",
				threshold: 0.03,
			}
		)

		const cards = gridRef.current.querySelectorAll("a")
		cards.forEach((card) => {
			card.classList.add("opacity-0")
			observer.observe(card)
		})

		return () => observer.disconnect()
	}, [videos])

	return (
		<div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{videos.map((video, index) => (
				<a
					key={video.id}
					href={`/cursos/${courseSlug}/${video.id}`}
					className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#B85440] hover:shadow-lg"
					data-animate-delay={`${index * 100}ms`}
				>
					{/* Thumbnail */}
					<div className="relative mb-4 overflow-hidden rounded-xl">
						<img
							src={video.thumbnailUrl}
							alt={video.title}
							className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B85440] shadow-lg">
								<svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z" />
								</svg>
							</div>
						</div>
						{/* Duration badge */}
						<div className="absolute right-2 bottom-2 rounded-lg bg-black/75 px-2 py-1 text-xs font-semibold text-white">
							{formatDuration(video.duration)}
						</div>
					</div>

					{/* Info */}
					<h3 className="text-primary font-display mb-2 text-lg font-semibold group-hover:text-[#B85440]">
						{video.title}
					</h3>
					<p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{video.description}</p>

					{/* Metadata */}
					<div className="flex flex-wrap gap-2">
						{video.metadata?.trimester && (
							<span className="inline-flex items-center gap-1 rounded-full bg-[#7A9582]/10 px-2 py-1 text-xs text-[#7A9582]">
								<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								{video.metadata.trimester}
							</span>
						)}
						{video.metadata?.level && (
							<span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
								{video.metadata.level}
							</span>
						)}
					</div>
				</a>
			))}
		</div>
	)
}
