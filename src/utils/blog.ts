import type { CollectionEntry } from "astro:content"

/**
 * Calculate estimated reading time based on word count
 * @param content - Markdown content string
 * @returns Reading time in minutes
 */
export function calculateReadTime(content: string): number {
	const wordsPerMinute = 200
	const words = content.trim().split(/\s+/).length
	const minutes = Math.ceil(words / wordsPerMinute)
	return minutes
}

/**
 * Format date to Spanish locale
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date)
}

/**
 * Get category color class based on category name
 * @param category - Category name
 * @returns Tailwind color class
 */
export function getCategoryColor(category: string): {
	bg: string
	text: string
	border: string
} {
	const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
		Lactancia: {
			bg: "bg-coral-light/20",
			text: "text-coral",
			border: "border-coral/30",
		},
		"Embarazo y Parto": {
			bg: "bg-accent/10",
			text: "text-accent",
			border: "border-accent/30",
		},
		Menopausia: {
			bg: "bg-sage/20",
			text: "text-sage",
			border: "border-sage/40",
		},
		"Salud Hormonal": {
			bg: "bg-secondary/20",
			text: "text-secondary",
			border: "border-secondary/30",
		},
	}

	return (
		categoryColors[category] || {
			bg: "bg-primary/10",
			text: "text-primary",
			border: "border-primary/30",
		}
	)
}

/**
 * Get related blog posts based on category and tags
 * @param currentPost - Current blog post
 * @param allPosts - Array of all blog posts
 * @param limit - Maximum number of related posts to return
 * @returns Array of related posts
 */
export function getRelatedPosts(
	currentPost: CollectionEntry<"blog">,
	allPosts: CollectionEntry<"blog">[],
	limit = 3,
): CollectionEntry<"blog">[] {
	const currentCategories = currentPost.data.categories
	const currentTags = currentPost.data.tags || []

	// Filter out the current post and draft posts
	const otherPosts = allPosts.filter(
		(post) => post.slug !== currentPost.slug && !post.data.draft,
	)

	// Score posts based on matching categories and tags
	const scoredPosts = otherPosts.map((post) => {
		let score = 0

		// Same category = +2 points
		const hasMatchingCategory = post.data.categories.some((cat) =>
			currentCategories.includes(cat),
		)
		if (hasMatchingCategory) score += 2

		// Same tag = +1 point each
		const postTags = post.data.tags || []
		const matchingTags = postTags.filter((tag) => currentTags.includes(tag))
		score += matchingTags.length

		return { post, score }
	})

	// Sort by score (highest first), then by date (newest first)
	scoredPosts.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score
		return b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime()
	})

	// Return top N posts
	return scoredPosts.slice(0, limit).map((item) => item.post)
}
