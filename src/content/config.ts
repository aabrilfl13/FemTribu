import { defineCollection, z } from "astro:content"

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z.object({
			name: z.string(),
			role: z.string(),
			image: z.string().optional(),
		}),
		heroImage: z.string().optional(),
		categories: z.array(z.string()),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().default(false),
	}),
})

export const collections = { blog }
