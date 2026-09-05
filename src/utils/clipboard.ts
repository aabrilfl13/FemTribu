/**
 * Copy text to the clipboard, with a fallback for the cases where the async
 * Clipboard API is unavailable.
 *
 * `navigator.clipboard` only exists in a secure context (HTTPS or localhost), so
 * it is missing when the site is opened over a LAN IP during development, and
 * some hardened browsers (Brave with aggressive Shields) can block it even on
 * HTTPS. The legacy `document.execCommand("copy")` path still works in both
 * cases, so we try the modern API first and fall back rather than failing.
 *
 * Must be called from a user gesture (click handler) with no awaits before it,
 * or the browser will reject the write.
 */

export interface CopyOptions {
	/**
	 * Where to mount the temporary textarea used by the fallback. Pass the dialog
	 * when copying from inside a `<dialog>` opened with showModal(): everything
	 * outside the dialog is inert, so a textarea on document.body cannot be
	 * selected and the fallback silently fails.
	 */
	container?: HTMLElement
}

/** Legacy path: select a hidden textarea and let the browser copy the selection. */
function copyWithExecCommand(text: string, container: HTMLElement): boolean {
	const textarea = document.createElement("textarea")
	textarea.value = text
	textarea.setAttribute("readonly", "")
	textarea.setAttribute("aria-hidden", "true")
	textarea.style.cssText =
		"position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;opacity:0;pointer-events:none;"

	container.appendChild(textarea)

	const selection = document.getSelection()
	const previousRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

	let copied = false
	try {
		textarea.focus({ preventScroll: true })
		textarea.select()
		// iOS ignores select() on a readonly textarea unless the range is explicit.
		textarea.setSelectionRange(0, text.length)
		copied = document.execCommand("copy")
	} catch {
		copied = false
	} finally {
		textarea.remove()
		// Restore whatever the visitor had selected before we hijacked it.
		if (previousRange && selection) {
			selection.removeAllRanges()
			selection.addRange(previousRange)
		}
	}

	return copied
}

/**
 * Returns true when the text reached the clipboard.
 */
export async function copyToClipboard(text: string, options: CopyOptions = {}): Promise<boolean> {
	const container = options.container ?? document.body

	// Modern path: needs a secure context and an unblocked permission.
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text)
			return true
		} catch {
			// Blocked, not focused, or refused by the browser — fall through.
		}
	}

	return copyWithExecCommand(text, container)
}
