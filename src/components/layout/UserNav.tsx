import { useEffect, useState } from "react"

import { fetchUser, getCachedUser, type AuthState, type CachedUser } from "@/lib/auth-client"

interface UserNavProps {
	initialUser?: CachedUser | null
}

export default function UserNav({ initialUser }: UserNavProps) {
	// Nav is now a static shell. Seed from (in order): a server-provided user
	// (SSR pages like /perfil), the session cache (repeat navigation — no flash),
	// or `undefined` on a first visit (render a neutral skeleton, never the
	// logged-out buttons). The server render is always `undefined` so initial
	// markup matches; the client lazy-initializer reads the cache before paint.
	const [user, setUser] = useState<AuthState>(initialUser)
	const [dropdownOpen, setDropdownOpen] = useState(false)

	useEffect(() => {
		// Seed from cache before fetching so repeat navigations don't flash.
		if (initialUser === undefined) {
			const cached = getCachedUser()
			if (cached !== undefined) setUser(cached)
		}
		fetchUser().then(setUser)
	}, [])

	// Setup click-outside handler for dropdown
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			if (!target.closest(".user-nav-dropdown")) {
				setDropdownOpen(false)
			}
		}

		document.addEventListener("click", handleClickOutside)
		return () => document.removeEventListener("click", handleClickOutside)
	}, [])

	// First visit, state unknown: neutral placeholder so we never flash the
	// logged-out buttons before the user is resolved.
	if (user === undefined) {
		return (
			<div
				className="h-10 w-28 animate-pulse rounded-full bg-white/10 [.scrolled_&]:bg-[#37443a]/10"
				aria-hidden="true"
			/>
		)
	}

	if (!user) {
		// Show Login/Register buttons
		return (
			<div className="flex items-center gap-3">
				<a
					href="/auth/login"
					className="text-base font-medium text-[#fff5eb] transition-all duration-300 hover:text-[#cb6e5f] [.scrolled_&]:text-[#37443a]"
				>
					Iniciar sesión
				</a>
				<a
					href="/auth/register"
					className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#B85440] to-[#D88B7D] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
				>
					Regístrate
				</a>
			</div>
		)
	}

	// Show user dropdown menu
	const initials = user.displayName
		? user.displayName
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user.email
			? user.email[0].toUpperCase()
			: "U"

	return (
		<div className="user-nav-dropdown relative">
			<button
				onClick={() => setDropdownOpen(!dropdownOpen)}
				className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 transition-all duration-300 hover:bg-white/20 [.scrolled_&]:bg-[#7A9582]/10 [.scrolled_&]:hover:bg-[#7A9582]/20"
				aria-expanded={dropdownOpen}
				aria-haspopup="true"
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#B85440] to-[#D88B7D] text-sm font-bold text-white shadow-sm">
					{initials}
				</div>
				<span className="max-w-[150px] truncate">
					{user.displayName || user.email || "Usuario"}
				</span>
				<svg
					className={`h-4 w-4 text-[#fff5eb] transition-transform duration-300 [.scrolled_&]:text-[#37443a] ${dropdownOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{dropdownOpen && (
				<div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
					{/* User info header */}
					<div className="border-b border-gray-100 px-4 py-3">
						<p className="truncate text-sm font-semibold text-[#37443a]">
							{user.displayName || user.email || "Usuario"}
						</p>
						{user.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
					</div>

					{/* Menu items */}
					<div className="py-2">
						<a
							href="/perfil"
							className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#37443a] transition-colors hover:bg-[#FAF7F5]"
						>
							<svg
								className="h-5 w-5 text-[#7A9582]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Mi perfil
						</a>

						<a
							href="/cursos"
							className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#37443a] transition-colors hover:bg-[#FAF7F5]"
						>
							<svg
								className="h-5 w-5 text-[#B85440]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Mis cursos
						</a>
					</div>

					{/* Logout */}
					<div className="border-t border-gray-100 pt-2">
						<a
							href="/auth/logout"
							className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							Cerrar sesión
						</a>
					</div>
				</div>
			)}
		</div>
	)
}
