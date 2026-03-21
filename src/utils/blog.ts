import type { Post } from "@/services/directus"

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
		"Lactancia": {
			bg: "bg-coral-light/20",
			text: "text-coral",
			border: "border-coral/30",
		},
		"Embarazo y Parto": {
			bg: "bg-accent/10",
			text: "text-accent",
			border: "border-accent/30",
		},
		"Menopausia": {
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

export function getRelatedPosts(currentPost: Post, allPosts: Post[], limit = 3): Post[] {
	const currentCategoryIds = currentPost.categories?.map((c) => c.category_id.id) ?? []
	const currentTagIds = currentPost.tags?.map((t) => t.tag_id.id) ?? []

	const otherPosts = allPosts.filter((post) => post.slug !== currentPost.slug)

	const scoredPosts = otherPosts.map((post) => {
		let score = 0

		const postCategoryIds = post.categories?.map((c) => c.category_id.id) ?? []
		if (postCategoryIds.some((id) => currentCategoryIds.includes(id))) score += 2

		const postTagIds = post.tags?.map((t) => t.tag_id.id) ?? []
		score += postTagIds.filter((id) => currentTagIds.includes(id)).length

		return { post, score }
	})

	scoredPosts.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score
		return b.post.date_published.getTime() - a.post.date_published.getTime()
	})

	return scoredPosts.slice(0, limit).map((item) => item.post)
}
