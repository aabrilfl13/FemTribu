/**
 * Email verification utility functions
 * Manages the state between email form, verification pending, and verified states
 */

interface AccessData {
	status: "pending" | "accepted"
	email: string
	code?: string
}

interface WebhookResponse {
	verified: boolean
}

// Extend Window interface to include custom properties
declare global {
	interface Window {
		verifyEmailAccess: () => void
		showNotification?: (message: string, type: string) => void
	}
}

export class EmailVerificationManager {
	private storageKey: string
	private emailOverlayId: string
	private verificationOverlayId: string

	constructor() {
		this.storageKey = "videoAccess"
		this.emailOverlayId = "email-overlay"
		this.verificationOverlayId = "verification-overlay"

		this.handleStorageChange = this.handleStorageChange.bind(this)

		// Initialize event listeners
		this.init()
	}

	/**
	 * Initialize the verification manager
	 */
	init() {
		// Check for verification parameters in URL
		this.checkVerificationParams()

		// Check status on page load
		document.addEventListener("DOMContentLoaded", () => {
			this.checkStatus()
		})

		// Listen for storage changes (multi-tab support)
		window.addEventListener("storage", this.handleStorageChange)

		if (this.getAccessData()) {
			const emailOverlay = document.getElementById(this.emailOverlayId)
			emailOverlay?.classList.add("hidden")
		}
	}

	/**
	 * Check URL parameters for automatic verification
	 */
	checkVerificationParams() {
		const urlParams = new URLSearchParams(window.location.search)
		const accessCode = urlParams.get("accessCode")

		if (accessCode) {
			// Auto-verify if URL contains verification parameters
			window.verifyEmailAccess()

			// Clean up URL (optional)
			const newUrl = window.location.pathname
			window.history.replaceState({}, document.title, newUrl)
		}
	}

	/**
	 * Get access data from localStorage
	 * @returns {Object|null} Access data or null if not found
	 */
	getAccessData() {
		try {
			const accessDataString = localStorage.getItem(this.storageKey)
			if (!accessDataString) return null

			return JSON.parse(accessDataString)
		} catch (error) {
			console.error("Error parsing access data:", error)
			this.clearAccessData()
			return null
		}
	}

	/**
	 * Set access data in localStorage
	 * @param {AccessData} data Access data to store
	 */
	setAccessData(data: AccessData): void {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(data))
		} catch (error) {
			console.error("Error storing access data:", error)
		}
	}

	/**
	 * Clear access data from localStorage
	 */
	clearAccessData() {
		localStorage.removeItem(this.storageKey)
	}

	/**
	 * Get email overlay element
	 * @returns {HTMLElement|null}
	 */
	getEmailOverlay() {
		return document.getElementById(this.emailOverlayId)
	}

	/**
	 * Get verification overlay element
	 * @returns {HTMLElement|null}
	 */
	getVerificationOverlay() {
		return document.getElementById(this.verificationOverlayId)
	}

	/**
	 * Show email form overlay
	 */
	showEmailForm() {
		const emailOverlay = this.getEmailOverlay()
		const verificationOverlay = this.getVerificationOverlay()

		emailOverlay?.classList.remove("hidden")
		verificationOverlay?.classList.add("hidden")
	}

	/**
	 * Hide all overlays (verified state)
	 */
	showVerifiedState() {
		const emailOverlay = this.getEmailOverlay()
		const verificationOverlay = this.getVerificationOverlay()

		emailOverlay?.classList.add("hidden")
		verificationOverlay?.classList.add("hidden")
	}

	/**
	 * Check email verification status and update UI accordingly
	 */
	checkStatus() {
		const accessData = this.getAccessData()

		// No access data - show email form
		if (!accessData) {
			this.showEmailForm()
			return
		}

		// Handle different statuses
		switch (accessData.status) {
			case "accepted":
				this.showVerifiedState()
				break
			case "pending":
				// this.showVerificationPending()
				this.showVerifiedState()
				break
			default:
				this.showEmailForm()
				break
		}
	}

	/**
	 * Handle localStorage changes from other tabs
	 * @param {StorageEvent} event Storage event
	 */
	handleStorageChange(event: StorageEvent) {
		if (event.key === this.storageKey) {
			this.checkStatus()
		}
	}

	/**
	 * Set email as pending verification
	 * @param {string} email User's email address
	 */
	setPendingVerification(email: string) {
		const accessData: AccessData = {
			status: "pending",
			email: email,
		}

		this.setAccessData(accessData)
		// this.checkStatus()
	}

	/**
	 * Mark email as verified and send data to backend
	 */
	async setVerified(email: string, code: string) {
		const accessData = this.getAccessData()

		if (accessData) {
			// Send verification data to backend via internal API
			try {
				const response = await fetch("/api/verify-email", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: email,
						code: code,
					}),
				})

				if (!response.ok) {
					console.error("Failed to send verification data to backend")
				}

				// Parse the webhook response
				let webhookData: WebhookResponse
				webhookData = await response.json()

				this.setAccessData({
					status: webhookData.verified === true ? "accepted" : "pending",
					email: email,
					code: code,
				})
			} catch (error) {
				console.error("Error sending verification data:", error)
			}
		}

		// Update access status to verified

		this.showVerifiedState()
		this.checkStatus()
	}

	/**
	 * Get stored email address
	 * @returns {string|null} Email address or null if not found
	 */
	getStoredEmail() {
		const accessData = this.getAccessData()
		return accessData?.email || null
	}

	/**
	 * Check if user has verified access
	 * @returns {boolean} True if verified
	 */
	hasVerifiedAccess() {
		const accessData = this.getAccessData()

		if (!accessData) return false

		return accessData.status === "accepted"
	}

	/**
	 * Reset to initial state
	 */
	reset() {
		this.clearAccessData()
		this.showEmailForm()
	}

	/**
	 * Cleanup event listeners
	 */
	destroy() {
		window.removeEventListener("storage", this.handleStorageChange)
	}
}

// Global verification function that can be called from email links
window.verifyEmailAccess = function () {
	const manager = new EmailVerificationManager()
	manager.setVerified()

	// Optional: Show success message
	const successMessage =
		"¡Email verificado correctamente! Te enviaremos el código de descuento al final del reto."

	// You can customize this notification method
	if (typeof window.showNotification === "function") {
		window.showNotification(successMessage, "success")
	} else {
		alert(successMessage)
	}
}

// Export for use in other modules
export default EmailVerificationManager
