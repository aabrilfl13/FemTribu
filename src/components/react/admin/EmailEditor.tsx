import { AnimatePresence, motion } from "framer-motion"
import * as Lucide from "lucide-react"
import { useEffect, useState } from "react"

// Estilos del editor de código
import "@styles/prism-custom.css"

import Prism from "prismjs"
// Importación del editor
import RawEditor from "react-simple-code-editor"

import "prismjs/components/prism-markup"
import "prismjs/themes/prism-tomorrow.css"

const CodeEditor = (RawEditor as any).default || RawEditor

const {
	Eye,
	EyeOff,
	Send,
	Smartphone,
	Users,
	Monitor,
	Columns2,
	Square,
	Settings,
	Moon,
	Sun,
	X,
	Globe,
	Key,
} = Lucide

export default function EmailEditor() {
	const [html, setHtml] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("emailEditor_html") || ""
		}
		return ""
	})
	const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split")
	const [device, setDevice] = useState<"mobile" | "desktop">("desktop")
	const [emailTheme, setEmailTheme] = useState<"light" | "dark">("light")
	const [isConfigOpen, setIsConfigOpen] = useState(false)

	const [endpoint, setEndpoint] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("emailEditor_endpoint") || "/api/send-email"
		}
		return "/api/send-email"
	})
	const [token, setToken] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("emailEditor_token") || ""
		}
		return ""
	})
	const [showToken, setShowToken] = useState(false)
	const [recipients, setRecipients] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("emailEditor_recipients") || "info@femmtribu.es"
		}
		return "info@femmtribu.es"
	})
	const [sendToAllCRM, setSendToAllCRM] = useState(false)
	const [isSending, setIsSending] = useState(false)

	// Guardar valores en localStorage cuando cambian
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("emailEditor_html", html)
		}
	}, [html])

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("emailEditor_endpoint", endpoint)
		}
	}, [endpoint])

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("emailEditor_token", token)
		}
	}, [token])

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("emailEditor_recipients", recipients)
		}
	}, [recipients])

	// Función para enviar el email
	const sendEmail = async () => {
		if (!html.trim()) {
			alert("Por favor, escribe el contenido del email")
			return
		}

		if (!token.trim()) {
			alert("Por favor, configura el token de autenticación")
			return
		}

		if (!sendToAllCRM && !recipients.trim()) {
			alert("Por favor, especifica los destinatarios o activa el envío a CRM")
			return
		}

		setIsSending(true)

		try {
			const body: any = {
				html: html,
			}

			if (sendToAllCRM) {
				body.all_crm_users = true
			} else {
				body.recipients = recipients
					.split(/[,\n]/)
					.map((r) => r.trim())
					.filter((r) => r.length > 0)
			}
			console.log("body:", body)

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": token,
				},
				body: JSON.stringify(body),
			})

			if (!response.ok) {
				const error = await response.text()
				throw new Error(error || "Error al enviar el email")
			}

			const result = await response.json()
			alert("Email enviado correctamente ✅")
			console.log("Resultado:", result)
		} catch (error: any) {
			console.error("Error al enviar:", error)
			alert(`Error al enviar el email: ${error.message}`)
		} finally {
			setIsSending(false)
		}
	}

	// Función para generar el contenido del iframe con "Force Override"
	const generateIframeContent = () => {
		const isDark = emailTheme === "dark"

		// Definimos los colores del manual de FemmTribu para inyectarlos a la fuerza
		const themeStyles = `
      <style id="theme-override">
        :root {
          --bg-main: ${isDark ? "#121212" : "#FFF5EB"} !important;
          --bg-card: ${isDark ? "#1E1E1E" : "#FFFFFF"} !important;
          --brand-primary: ${isDark ? "#D68273" : "#CB6E5F"} !important;
          --brand-dark: ${isDark ? "#E5E5E5" : "#37443A"} !important;
          --text-main: ${isDark ? "#E5E5E5" : "#37443A"} !important;
          --text-muted: ${isDark ? "#A0A0A0" : "#666666"} !important;
          --divider: ${isDark ? "rgba(255, 255, 255, 0.1)" : "#eeeeee"} !important;
        }
        body { 
          background-color: var(--bg-main) !important; 
          color: var(--text-main) !important;
          transition: all 0.3s ease;
        }
        /* Forzamos que cualquier div o table que use las variables también se actualice */
        [style*="var(--bg-main)"] { background-color: var(--bg-main) !important; }
        [style*="var(--text-main)"] { color: var(--text-main) !important; }
      </style>
    `

		// Insertamos nuestros estilos justo antes de cerrar el body para que tengan prioridad máxima
		const finalHtml = html.includes("</body>")
			? html.replace("</body>", `${themeStyles}</body>`)
			: `${html}${themeStyles}`

		return finalHtml
	}

	return (
		<div className="animate-fade-in relative flex h-[calc(100vh-220px)] flex-col gap-6">
			{/* TOOLBAR */}
			<div className="border-coral-light/20 flex shrink-0 items-center justify-between rounded-2xl border bg-white p-3 shadow-sm">
				<div className="flex gap-1 rounded-xl bg-gray-50 p-1">
					<button
						onClick={() => setViewMode("editor")}
						className={`rounded-lg p-2 ${viewMode === "editor" ? "text-primary bg-white shadow-sm" : "text-gray-400"}`}
					>
						<Square size={18} />
					</button>
					<button
						onClick={() => setViewMode("split")}
						className={`rounded-lg p-2 ${viewMode === "split" ? "text-primary bg-white shadow-sm" : "text-gray-400"}`}
					>
						<Columns2 size={18} />
					</button>
					<button
						onClick={() => setViewMode("preview")}
						className={`rounded-lg p-2 ${viewMode === "preview" ? "text-primary bg-white shadow-sm" : "text-gray-400"}`}
					>
						<Eye size={18} />
					</button>
				</div>

				<div className="flex items-center gap-3">
					{/* TOGGLE DARK/LIGHT */}
					<div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1">
						<button
							onClick={() => setEmailTheme("light")}
							className={`rounded-lg p-2 transition ${emailTheme === "light" ? "bg-white text-yellow-600 shadow-sm" : "text-gray-400"}`}
						>
							<Sun size={18} />
						</button>
						<button
							onClick={() => setEmailTheme("dark")}
							className={`rounded-lg p-2 transition ${emailTheme === "dark" ? "bg-primary text-white shadow-sm" : "text-gray-400"}`}
						>
							<Moon size={18} />
						</button>
					</div>

					{viewMode !== "editor" && (
						<div className="mr-2 flex rounded-lg border border-gray-200 bg-gray-100 p-1">
							<button
								onClick={() => setDevice("desktop")}
								className={`rounded-md p-1.5 transition ${device === "desktop" ? "text-primary bg-white shadow-sm" : "text-gray-400"}`}
							>
								<Monitor size={16} />
							</button>
							<button
								onClick={() => setDevice("mobile")}
								className={`rounded-md p-1.5 transition ${device === "mobile" ? "text-primary bg-white shadow-sm" : "text-gray-400"}`}
							>
								<Smartphone size={16} />
							</button>
						</div>
					)}

					<button
						onClick={() => setIsConfigOpen(true)}
						className="text-secondary rounded-xl bg-gray-50 p-2.5 hover:bg-gray-100"
					>
						<Settings size={18} />
					</button>
					<button
						onClick={sendEmail}
						disabled={isSending}
						className={`bg-terracotta shadow-terracotta/20 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform ${isSending ? "cursor-not-allowed opacity-60" : "hover:scale-[1.02]"}`}
					>
						<Send size={16} /> {isSending ? "Enviando..." : "Enviar"}
					</button>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 gap-6 overflow-hidden">
				{/* EDITOR */}
				{(viewMode === "split" || viewMode === "editor") && (
					<div
						className={`flex h-full flex-col overflow-hidden ${viewMode === "split" ? "w-1/2" : "w-full"}`}
					>
						<div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#1a1b1e] font-mono shadow-2xl">
							<div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-[#25262b] px-5 py-2.5 text-[10px] tracking-widest text-gray-500 uppercase">
								<div className="flex gap-1.5">
									<div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
									<div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
									<div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
								</div>
								<span>editor.html</span>
							</div>
							<div className="custom-scrollbar flex-1 overflow-auto bg-[#1a1b1e]">
								<CodeEditor
									value={html}
									onValueChange={setHtml}
									highlight={(code: string) =>
										Prism.highlight(code, Prism.languages.markup, "markup")
									}
									padding={24}
									className="prism-editor-wrapper"
								/>
							</div>
						</div>
					</div>
				)}

				{/* PREVIEW */}
				{(viewMode === "split" || viewMode === "preview") && (
					<div
						className={`flex h-full min-h-0 flex-col items-center ${viewMode === "split" ? "w-1/2" : "w-full"}`}
					>
						<div
							className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl transition-all duration-500 ${device === "mobile" ? "max-w-[375px]" : ""}`}
						>
							<div className="flex items-center justify-between border-b bg-gray-50 p-3 font-mono text-[9px] text-gray-400">
								<div className="flex gap-4">
									<button
										onClick={() => setDevice("desktop")}
										className={device === "desktop" ? "text-primary font-bold" : ""}
									>
										DESKTOP
									</button>
									<button
										onClick={() => setDevice("mobile")}
										className={device === "mobile" ? "text-primary font-bold" : ""}
									>
										MOBILE
									</button>
								</div>
								<span>PREVIEW MODE: {emailTheme.toUpperCase()}</span>
							</div>
							<iframe
								key={emailTheme} // Forzamos el refresco del iframe al cambiar el tema
								srcDoc={generateIframeContent()}
								className="w-full flex-1 border-none"
							/>
						</div>
					</div>
				)}

				{/* MODAL CONFIGURACIÓN */}
				<AnimatePresence>
					{isConfigOpen && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setIsConfigOpen(false)}
								className="absolute inset-0 z-40 rounded-3xl bg-[rgb(55,68,58)]/20 backdrop-blur-sm"
							/>
							<motion.div
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}
								className="absolute top-0 right-0 bottom-0 z-50 flex w-80 flex-col gap-6 rounded-r-3xl border-l border-[rgb(227,161,150)]/20 bg-white p-8 shadow-2xl"
							>
								<div className="flex items-center justify-between">
									<h3 className="font-display text-2xl text-[rgb(55,68,58)] italic">Ajustes</h3>
									<button
										onClick={() => setIsConfigOpen(false)}
										className="rounded-full p-2 transition-colors hover:bg-gray-100"
									>
										<X size={20} />
									</button>
								</div>
								<div className="space-y-4">
									<ConfigField
										label="API Endpoint"
										icon={<Globe size={12} />}
										value={endpoint}
										onChange={setEndpoint}
									/>
									<ConfigField
										label="Token"
										icon={<Key size={12} />}
										value={token}
										onChange={setToken}
										isPassword
										showPassword={showToken}
										onTogglePassword={() => setShowToken(!showToken)}
									/>
									<ConfigField
										label="Destinatarios"
										icon={<Users size={12} />}
										value={recipients}
										onChange={setRecipients}
										isTextArea
										disabled={sendToAllCRM}
									/>
									<div className="space-y-2">
										<label className="flex cursor-pointer items-center gap-3">
											<input
												type="checkbox"
												checked={sendToAllCRM}
												onChange={(e) => setSendToAllCRM(e.target.checked)}
												className="h-4 w-4 rounded border-gray-300 text-[rgb(204,124,118)] focus:ring-[rgb(204,124,118)]"
											/>
											<span className="text-xs font-medium text-[rgb(55,68,58)]">
												Enviar a todos los contactos del CRM
											</span>
										</label>
									</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

function ToolbarButton({ active, onClick, icon, label }: any) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all ${active ? "bg-white text-[rgb(55,68,58)] shadow-sm" : "text-gray-400 hover:text-[rgb(55,68,58)]"}`}
		>
			{icon} <span>{label}</span>
		</button>
	)
}

function ConfigField({
	label,
	icon,
	value,
	onChange,
	isTextArea,
	disabled,
	isPassword,
	showPassword,
	onTogglePassword,
}: any) {
	return (
		<div className="space-y-2">
			<label
				className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${disabled ? "text-gray-400" : "text-gray-500"}`}
			>
				{icon} {label}
			</label>
			{isTextArea ? (
				<textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className={`h-32 w-full resize-none rounded-xl border border-gray-100 p-3 text-xs outline-none focus:ring-1 focus:ring-[rgb(204,124,118)] ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-gray-50"}`}
				/>
			) : (
				<div className="relative">
					<input
						type={isPassword && !showPassword ? "password" : "text"}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						disabled={disabled}
						className={`w-full rounded-xl border border-gray-100 p-3 text-xs outline-none focus:ring-1 focus:ring-[rgb(204,124,118)] ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-gray-50"} ${isPassword ? "pr-10" : ""}`}
					/>
					{isPassword && onTogglePassword && (
						<button
							type="button"
							onClick={onTogglePassword}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
						>
							{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
						</button>
					)}
				</div>
			)}
		</div>
	)
}
