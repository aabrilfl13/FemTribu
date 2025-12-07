// @ts-check
import { defineConfig } from "astro/config"

import tailwindcss from "@tailwindcss/vite"

import vercel from "@astrojs/vercel"

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

	output: "static",
	adapter: vercel({
		edgeMiddleware: true,
	}),
	site: "https://femmtribu.es",
	compressHTML: true,
})
