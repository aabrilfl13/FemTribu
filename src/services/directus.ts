import { createDirectus, readItems, rest, staticToken } from "@directus/sdk"

type Global = {
	title: string
	description: string
}

export type Author = {
	name: string
	role: string
	image: string
}

type Page = {
	title: string
	content: string
	slug: string
}

export type Category = {
	id: number
	name: string
}

export type Tag = {
	id: number
	name: string
}

type PostCategory = {
	category_id: Category
}

type PostTag = {
	tag_id: Tag
}

type PostAuthor = {
	author_id: Author
}

export type Post = {
	id: number
	title: string
	description: string
	date_published: Date
	date_updated: Date | null
	authors: PostAuthor[]
	hero_image: string
	categories: PostCategory[]
	tags: PostTag[]
	status: "published" | "draft" | "archived"
	slug: string
	content: string
}

type Schema = {
	post: Post[]
	global: Global
	pages: Page[]
}

const directus = createDirectus<Schema>(import.meta.env.DIRECTUS_URL)
	.with(staticToken(import.meta.env.DIRECTUS_TOKEN))
	.with(rest())

export const getAssetUrl = (uuid: string) => `${import.meta.env.DIRECTUS_URL}/assets/${uuid}`

const postFields = [
	"*",
	{ authors: [{ author_id: ["*"] }] },
	{ categories: [{ category_id: ["*"] }] },
	{ tags: [{ tag_id: ["*"] }] },
] as any

export async function getPosts(): Promise<Post[]> {
	const posts = await directus.request(
		readItems("post", {
			filter: { status: { _eq: "published" } },
			sort: ["-date_published"],
			fields: postFields,
		})
	)
	return posts.map(transformPost)
}

export async function getPostBySlug(slug: string) {
	const posts = await directus.request(
		readItems("post", {
			filter: { slug: { _eq: slug }, status: { _eq: "published" } },
			fields: postFields,
			limit: 1,
		})
	)
	return transformPost(posts[0])
}

export async function getPostSlugs() {
	const posts = await directus.request(
		readItems("post", {
			filter: { status: { _eq: "published" } },
			fields: ["slug"] as any,
		})
	)
	return posts.map((post) => post.slug as string)
}

function transformPost(post: any): Post {
	return {
		...post,
		date_published: new Date(post.date_published),
		date_updated: post.date_updated ? new Date(post.date_updated) : null,
	}
}

export default directus
