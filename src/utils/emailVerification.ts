/**
 * Email verification utility functions
 * Manages the state between email form, verification pending, and verified states
 */

interface AccessData {
	status: "pending" | "accepted"
	email: string
	expires: number
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

		// Bind methods to preserve 'this' context
		this.checkStatus = this.checkStatus.bind(this)
		this.handleStorageChange = this.handleStorageChange.bind(this)

		// Initialize event listeners
		this.init()
	}

	/**
	 * Initialize the verification manager
	 */
	init() {
		// Check status on page load
		document.addEventListener("DOMContentLoaded", () => {
			this.checkStatus()
		})

		// Listen for storage changes (multi-tab support)
		window.addEventListener("storage", this.handleStorageChange)

		// Check verification status periodically
		setInterval(this.checkStatus, 1000) // Every 30 seconds
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
	 * Show verification pending overlay
	 */
	showVerificationPending() {
		const emailOverlay = this.getEmailOverlay()
		const verificationOverlay = this.getVerificationOverlay()

		emailOverlay?.classList.add("hidden")
		verificationOverlay?.classList.remove("hidden")
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
	 * Check if access has expired
	 * @param {Object} accessData Access data object
	 * @returns {boolean} True if expired
	 */
	isExpired(accessData: AccessData) {
		if (!accessData.expires) return false

		const now = Date.now()
		return now > accessData.expires && accessData.status !== "accepted"
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

		// Check if access has expired
		if (this.isExpired(accessData)) {
			this.clearAccessData()
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
	 * @param {number} expirationTime Expiration timestamp (optional)
	 */
	setPendingVerification(email: string, expirationTime: number | null = null) {
		const accessData: AccessData = {
			status: "pending",
			email: email,
			expires: expirationTime || Date.now() + 30 * 60 * 1000, // 30 minutes default
		}

		this.setAccessData(accessData)
		this.checkStatus()
	}

	/**
	 * Mark email as verified
	 * @param {number} expirationTime New expiration time (optional, defaults to 24 hours)
	 */
	setVerified(expirationTime = null) {
		const accessData = this.getAccessData()

		if (accessData) {
			accessData.status = "accepted"
			accessData.expires = expirationTime || Date.now() + 24 * 60 * 60 * 1000 // 24 hours default

			this.setAccessData(accessData)
			this.checkStatus()
		}
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
		if (this.isExpired(accessData)) return false

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
	const successMessage = "¡Email verificado correctamente! Ya puedes acceder a todos los recursos."

	// You can customize this notification method
	if (typeof window.showNotification === "function") {
		window.showNotification(successMessage, "success")
	} else {
		alert(successMessage)
	}
}

// Export for use in other modules
export default EmailVerificationManager
