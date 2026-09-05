/**
 * Toast notifications.
 *
 * Extracted from CookiesOverlay so any page or component can use the same
 * notification, with the same look, without depending on the cookie manager.
 *
 * Usage:
 *   import { showToast } from "@/utils/toast"
 *   showToast("¡Enlace copiado!", { type: "success" })
 *
 * Inside a <dialog> opened with showModal(), pass the dialog as `container`:
 * the dialog sits in the top layer, so a toast appended to document.body would
 * render behind its backdrop regardless of z-index.
 */

export type ToastType = "success" | "info" | "error"

export interface ToastOptions {
	type?: ToastType
	/** Where to mount the toast. Defaults to document.body. */
	container?: HTMLElement
	/** Auto-dismiss delay in ms. Pass 0 to keep it until dismissed. */
	duration?: number
}

const STYLE_ID = "femm-toast-styles"
const HOST_CLASS = "femm-toast-host"
const DEFAULT_DURATION = 5000
const EXIT_MS = 300

const BACKGROUNDS: Record<ToastType, string> = {
	success: "#6a8067",
	error: "#e74c3c",
	info: "#cb6e5f",
}

function injectStyles(): void {
	if (document.getElementById(STYLE_ID)) return

	const styles = document.createElement("style")
	styles.id = STYLE_ID
	styles.textContent = `
		.${HOST_CLASS} {
			position: fixed;
			top: 20px;
			right: 20px;
			z-index: 1001;
			display: flex;
			flex-direction: column;
			gap: 10px;
			max-width: min(300px, calc(100vw - 40px));
			pointer-events: none;
		}
		.femm-toast {
			pointer-events: auto;
			color: white;
			padding: 15px 20px;
			border-radius: 10px;
			box-shadow: 0 4px 15px rgba(55, 68, 58, 0.3);
			animation: femmToastIn 0.3s ease-in-out;
		}
		.femm-toast.is-leaving {
			animation: femmToastIn 0.3s ease-in-out reverse;
		}
		.femm-toast-content {
			display: flex;
			align-items: center;
			gap: 10px;
			font-family: "Questrial", sans-serif;
			font-size: 0.9rem;
		}
		.femm-toast-message {
			flex: 1;
		}
		.femm-toast-close {
			background: none;
			border: none;
			color: white;
			cursor: pointer;
			padding: 0;
			width: 20px;
			height: 20px;
			opacity: 0.8;
			transition: opacity 0.3s ease;
			flex-shrink: 0;
		}
		.femm-toast-close:hover {
			opacity: 1;
		}
		.femm-toast-close svg {
			width: 16px;
			height: 16px;
		}
		@keyframes femmToastIn {
			from { transform: translateX(100%); opacity: 0; }
			to { transform: translateX(0); opacity: 1; }
		}
		@media (prefers-reduced-motion: reduce) {
			.femm-toast,
			.femm-toast.is-leaving {
				animation: none;
			}
		}
	`
	document.head.appendChild(styles)
}

/**
 * One host per container, so several toasts stack instead of covering each other.
 */
function getHost(container: HTMLElement): HTMLElement {
	const existing = container.querySelector<HTMLElement>(`:scope > .${HOST_CLASS}`)
	if (existing) return existing

	const host = document.createElement("div")
	host.className = HOST_CLASS
	container.appendChild(host)
	return host
}

function dismiss(toast: HTMLElement): void {
	if (!toast.parentElement) return
	toast.classList.add("is-leaving")
	setTimeout(() => toast.remove(), EXIT_MS)
}

/**
 * Show a toast. Returns a function that dismisses it early.
 */
export function showToast(message: string, options: ToastOptions = {}): () => void {
	if (typeof document === "undefined") return () => {}

	const { type = "info", container = document.body, duration = DEFAULT_DURATION } = options

	injectStyles()

	const toast = document.createElement("div")
	toast.className = `femm-toast femm-toast-${type}`
	toast.style.background = BACKGROUNDS[type]
	// Errors interrupt; success and info are announced without stealing focus.
	toast.setAttribute("role", type === "error" ? "alert" : "status")
	toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite")

	const content = document.createElement("div")
	content.className = "femm-toast-content"

	const text = document.createElement("span")
	text.className = "femm-toast-message"
	// textContent, never innerHTML: a message may carry user-supplied text.
	text.textContent = message

	const close = document.createElement("button")
	close.type = "button"
	close.className = "femm-toast-close"
	close.setAttribute("aria-label", "Cerrar notificación")
	close.innerHTML =
		'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>'
	close.addEventListener("click", () => dismiss(toast))

	content.append(text, close)
	toast.appendChild(content)
	getHost(container).appendChild(toast)

	if (duration > 0) {
		setTimeout(() => dismiss(toast), duration)
	}

	return () => dismiss(toast)
}
