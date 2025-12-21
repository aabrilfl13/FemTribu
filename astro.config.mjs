// @ts-check
import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
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
	integrations: [sitemap()],
})
