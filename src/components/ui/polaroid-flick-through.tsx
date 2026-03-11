import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

interface ImageData {
	src: string
	alt: string
	id: string
}

interface ImageStackProps {
	images?: ImageData[]
	className?: string
	/** Seconds each card stays on top before cycling */
	interval?: number
}

const ImageStack: React.FC<ImageStackProps> = ({ images = [], className = "", interval = 1.5 }) => {
	const [imagesLoaded, setImagesLoaded] = React.useState(false)
	const [started, setStarted] = React.useState(false)
	const [activeIndex, setActiveIndex] = React.useState(-1)

	const containerRef = React.useRef<HTMLDivElement>(null)
	const prefersReducedMotion = useReducedMotion()

	// Responsive
	const [containerWidth, setContainerWidth] = React.useState(0)
	React.useEffect(() => {
		const el = containerRef.current
		if (!el) return
		const ro = new ResizeObserver(([entry]) => {
			setContainerWidth(entry.contentRect.width)
		})
		ro.observe(el)
		return () => ro.disconnect()
	}, [])

	const isSmall = containerWidth > 0 && containerWidth < 400
	const isMobile = containerWidth > 0 && containerWidth < 640
	const cardW = isSmall ? 200 : isMobile ? 250 : 300
	const cardH = isSmall ? 260 : isMobile ? 320 : 380
	const cardPadding = isSmall ? 12 : isMobile ? 16 : 20
	const textHeight = 36
	const totalCardH = cardH + cardPadding * 2 + textHeight

	// Preload images
	React.useEffect(() => {
		let cancelled = false
		Promise.all(
			images.map(
				(img) =>
					new Promise<void>((resolve) => {
						const el = new Image()
						el.onload = () => resolve()
						el.onerror = () => resolve()
						el.src = img.src
					})
			)
		).then(() => {
			if (!cancelled) setImagesLoaded(true)
		})
		return () => {
			cancelled = true
		}
	}, [images])

	// Start on intersection
	React.useEffect(() => {
		const el = containerRef.current
		if (!el || !imagesLoaded) return
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setStarted(true)
			},
			{ threshold: 0.2 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [imagesLoaded])

	// Infinite loop: advance to next card
	React.useEffect(() => {
		if (!started || images.length === 0) return
		const timer = setTimeout(
			() => setActiveIndex((prev) => (prev + 1) % images.length),
			interval * 1000
		)
		return () => clearTimeout(timer)
	}, [started, activeIndex, images.length, interval])

	const springTransition = prefersReducedMotion
		? { type: "tween" as const, duration: 0.4 }
		: { type: "spring" as const, stiffness: 100, damping: 16 }

	return (
		<div
			ref={containerRef}
			className={`relative flex w-full items-center justify-center overflow-hidden ${className}`}
			style={{ height: totalCardH + 80 }}
		>
			{!imagesLoaded && <div className="text-forest/50 font-body">Cargando imagenes...</div>}

			{started &&
				images.map((image, index) => {
					const isActive = index === activeIndex

					// Stack order: active card peels up then goes to bottom
					// distFromActive=0 is the card currently on top (next after active)
					const distFromActive =
						activeIndex >= 0
							? (index - activeIndex - 1 + images.length) % images.length
							: images.length - 1 - index
					// Reverse so 0 = top of stack, higher = further back
					const stackPos = images.length - 1 - distFromActive
					const zIndex = isActive ? images.length + 1 : stackPos

					// Stacked offset: each card behind peeks out slightly
					const stackOffset = distFromActive * 4
					const stackRotation = distFromActive * -1.5

					return (
						<motion.div
							key={image.id}
							className="absolute"
							animate={
								isActive
									? { x: 20, y: -1, rotate: 5, scale: 1.02 }
									: { x: stackOffset, y: stackOffset, rotate: stackRotation, scale: 1 }
							}
							transition={springTransition}
							style={{
								left: "50%",
								top: "50%",
								marginLeft: -(cardW / 2 + cardPadding),
								marginTop: -(totalCardH / 2),
								zIndex,
							}}
						>
							<div
								className="border-sage/20 rounded-sm border bg-white shadow-xs"
								style={{ padding: cardPadding }}
							>
								<img
									src={image.src}
									alt={image.alt}
									className="rounded-sm object-cover"
									style={{ width: cardW, height: cardH }}
									onError={(e) => {
										e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${cardW}' height='${cardH}'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E`
									}}
								/>
								<div className="font-body text-forest/60 mt-3 text-center text-sm font-medium md:text-base">
									{image.alt}
								</div>
							</div>
						</motion.div>
					)
				})}
		</div>
	)
}

export default ImageStack
export { type ImageData, type ImageStackProps }
