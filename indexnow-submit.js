// indexnow-submit.js
import { XMLParser } from "fast-xml-parser"

const API_KEY = "9d22c48cd13947aeb637d43e451f707c"
const SITE_URL = "https://femmtribu.es"
const SITEMAP_URL = `${SITE_URL}/sitemap-index.xml` // o sitemap-0.xml si usas ese

// Parse command-line arguments
const args = process.argv.slice(2)
const VERBOSE = args.includes("--verbose") || args.includes("-v")

async function getUrlsFromSitemap() {
	try {
		console.log("📡 Obteniendo URLs del sitemap...")
		const response = await fetch(SITEMAP_URL)

		if (!response.ok) {
			throw new Error(`Error al obtener sitemap: ${response.status}`)
		}

		const xml = await response.text()
		const parser = new XMLParser()
		const result = parser.parse(xml)

		let urls = []

		// Si es un sitemap index (contiene otros sitemaps)
		if (result.sitemapindex) {
			console.log("📋 Sitemap index detectado, obteniendo sub-sitemaps...")
			const sitemaps = Array.isArray(result.sitemapindex.sitemap)
				? result.sitemapindex.sitemap
				: [result.sitemapindex.sitemap]

			for (const sitemap of sitemaps) {
				const subResponse = await fetch(sitemap.loc)
				const subXml = await subResponse.text()
				const subResult = parser.parse(subXml)

				const subUrls = Array.isArray(subResult.urlset.url)
					? subResult.urlset.url.map((entry) => entry.loc)
					: [subResult.urlset.url.loc]

				urls = urls.concat(subUrls)
			}
		}
		// Si es un sitemap directo
		else if (result.urlset) {
			urls = Array.isArray(result.urlset.url)
				? result.urlset.url.map((entry) => entry.loc)
				: [result.urlset.url.loc]
		}

		console.log(`✓ ${urls.length} URLs encontradas`)
		return urls
	} catch (error) {
		console.error("✗ Error al leer sitemap:", error.message)
		throw error
	}
}

async function submitToIndexNow(urls) {
	const payload = {
		host: SITE_URL,
		key: API_KEY,
		keyLocation: `${SITE_URL}/${API_KEY}.txt`,
		urlList: urls,
	}

	try {
		console.log("📤 Enviando a IndexNow...")
		const response = await fetch("https://api.indexnow.org/indexnow", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		})

		if (response.ok) {
			console.log(`✓ Enviado exitosamente (${response.status})`)
			console.log(`  URLs notificadas: ${urls.length}`)

			if (VERBOSE) {
				console.log("\n📋 URLs enviadas:")
				urls.forEach((url, index) => {
					console.log(`  ${index + 1}. ${url}`)
				})
			}
		} else {
			console.error(`✗ Error en la respuesta: ${response.status}: ${await response.text()}`)
		}
	} catch (error) {
		console.error("✗ Error al enviar a IndexNow:", error.message)
		throw error
	}
}

async function main() {
	console.log("🚀 Iniciando notificación a IndexNow\n")

	if (VERBOSE) {
		console.log("📝 Modo verbose activado\n")
	}

	try {
		const urls = await getUrlsFromSitemap()
		await submitToIndexNow(urls)
		console.log("\n✅ Proceso completado")
	} catch (error) {
		console.error("\n❌ Proceso fallido")
		process.exit(1)
	}
}

main()
