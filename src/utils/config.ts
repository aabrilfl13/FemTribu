/**
 * Global configuration utility for accessing environment variables
 * This ensures consistent access to env vars across the application
 */

interface Config {
	webhookUrl: string
	authToken: string
}

/**
 * Get webhook configuration from environment variables
 * Throws an error if required environment variables are not set
 */
export function getWebhookConfig(): Config {
	const webhookUrl = import.meta.env.WEBHOOK_URL
	const authToken = import.meta.env.WEBHOOK_AUTH_TOKEN

	if (!webhookUrl || !authToken) {
		throw new Error("WEBHOOK_URL or WEBHOOK_AUTH_TOKEN environment variables are not set")
	}

	return {
		webhookUrl,
		authToken,
	}
}

/**
 * Check if webhook configuration is available
 * Returns true if all required env vars are set, false otherwise
 */
export function isWebhookConfigured(): boolean {
	try {
		getWebhookConfig()
		return true
	} catch {
		return false
	}
}

/**
 * Get individual environment variables with fallbacks
 */
export const env = {
	get webhookUrl() {
		return import.meta.env.WEBHOOK_URL
	},
	get authToken() {
		return import.meta.env.WEBHOOK_AUTH_TOKEN
	},
	get isDev() {
		return import.meta.env.DEBUG == true
	},
	get isProd() {
		return import.meta.env.DEBUG == false
	},
} as const
