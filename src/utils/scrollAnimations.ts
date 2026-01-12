/**
 * Scroll-triggered animations utility
 * Observes elements and triggers animations when they enter the viewport
 * Animations only play once per element
 */

export function initScrollAnimations() {
	// Configuration
	const observerOptions = {
		root: null, // Use viewport as root
		rootMargin: "0px 0px -100px 0px", // Trigger slightly before element is fully visible
		threshold: 0.1, // Trigger when 10% of element is visible
	}

	// Find all elements with data-animate attribute
	const animatedElements = document.querySelectorAll("[data-animate]")

	if (animatedElements.length === 0) return

	// Create Intersection Observer
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const element = entry.target as HTMLElement
				const animationClass = element.dataset.animate

				if (animationClass) {
					// Add the animation class
					element.classList.add(animationClass)

					// Optionally add custom duration if specified
					if (element.dataset.animateDuration) {
						element.style.animationDuration = element.dataset.animateDuration
					}

					// Optionally add custom delay if specified
					if (element.dataset.animateDelay) {
						element.style.animationDelay = element.dataset.animateDelay
					}

					// Stop observing this element (animation only plays once)
					observer.unobserve(element)
				}
			}
		})
	}, observerOptions)

	// Observe all animated elements
	animatedElements.forEach((element) => {
		// Initially hide elements that will animate in
		element.classList.add("opacity-0")
		observer.observe(element)
	})
}
