// @ts-check
import path from "path"
import { fileURLToPath } from "url"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@auth": path.resolve(__dirname, "./src/lib/auth"),
				"@events": path.resolve(__dirname, "./src/lib/events"),
				"@videos": path.resolve(__dirname, "./src/lib/videos"),
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
				const excludePaths = [
					"/newsletter/",
					"/admin/",
					"/cookies/",
					"/privacy/",
					"/blog/preview/",
					"/perfil/",
          "/auth/",
				]
				return !excludePaths.some((path) => page.includes(path))
			},
		}),
		react(),
	],
})
