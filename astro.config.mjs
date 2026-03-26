// @ts-check
import "dotenv/config"

import path from "path"
import { fileURLToPath } from "url"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
/** @type {Record<string, string>} */
const blogLastModMap = {}
try {
	const res = await fetch(
		`${process.env.DIRECTUS_URL}/items/post?filter[status][_eq]=published&fields=slug,date_published,date_updated`,
		{
			headers: { Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}` },
		}
	)

	if (res.ok) {
		const { data } = await res.json()
		for (const post of data) {
			const date = post.date_updated || post.date_published
			blogLastModMap[post.slug] = new Date(date).toISOString().split("T")[0]
		}
	}
} catch {
	// Directus unavailable at build time — fall back to build date
}

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@styles": path.resolve(__dirname, "./src/styles"),
			},
		},
		build: {
			// Additional optimizations
			cssCodeSplit: true,
			assetsInlineLimit: 4096,
		},
	},

	build: {
		// Inline CSS to eliminate render-blocking requests
		inlineStylesheets: "always",
	},

	output: "server",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),

	site: "https://femmtribu.es",
	compressHTML: true,
	integrations: [
		sitemap({
			filter: (page) => {
				const excludePaths = ["/newsletter/", "/admin/", "/cookies/", "/privacy/", "/blog/preview/"]
				return !excludePaths.some((path) => page.includes(path))
			},
			serialize: (item) => {
				const slug = item.url.replace(/\/$/, "").split("/").pop()
				if (item.url.includes("/blog/") && slug && blogLastModMap[slug]) {
					item.lastmod = blogLastModMap[slug]
				}
				return item
			},
		}),
		react(),
	],
})
