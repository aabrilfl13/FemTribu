import { useEffect, useState } from "react"

import { fetchUser, getCachedUser, type AuthState, type CachedUser } from "@/lib/auth-client"

interface MobileMenuAuthProps {
	initialUser?: CachedUser | null
}

export default function MobileMenuAuth({ initialUser }: MobileMenuAuthProps) {
	// Seed from server user / session cache / undefined — see UserNav for the
	// full rationale. Static nav shell + client-cached auth = no logged-out flash.
	const [user, setUser] = useState<AuthState>(initialUser)

	useEffect(() => {
		if (initialUser === undefined) {
			const cached = getCachedUser()
			if (cached !== undefined) setUser(cached)
		}
		fetchUser().then(setUser)
	}, [])

	// First visit, state unknown: neutral skeleton instead of the login buttons.
	if (user === undefined) {
		return (
			<div className="mobile-auth-section mb-6 flex w-full flex-col gap-2 pb-8" aria-hidden="true">
				<div className="mb-4 flex items-center gap-4">
					<div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-full bg-[#37443a]/10" />
					<div className="flex-1 space-y-2">
						<div className="h-4 w-32 animate-pulse rounded bg-[#37443a]/10" />
						<div className="h-3 w-40 animate-pulse rounded bg-[#37443a]/10" />
					</div>
				</div>
			</div>
		)
	}

	const displayName = user?.displayName || user?.email?.split("@")[0] || "Usuario"
	const initials = user
		? displayName
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: ""

	return (
		<div className="mobile-auth-section mb-6 flex w-full flex-col gap-2 pb-8">
			{user ? (
				<>
					{/* User Profile Header */}
					<div className="mb-4 flex items-center gap-4">
						<div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B85440] to-[#D88B7D] text-lg font-bold text-white shadow-lg ring-4 ring-white/30">
							{initials}
						</div>
						<div className="flex-1 text-left">
							<p className="font-display text-lg font-semibold text-[#37443a]">{displayName}</p>
							<p className="text-sm text-[#37443a]/60">{user.email}</p>
						</div>
					</div>
					{/* User Actions */}
					<a
						href="/perfil"
						className="mobile-auth-link flex items-center gap-3 py-3 text-base text-[#37443a]"
					>
						<svg
							className="h-5 w-5 flex-shrink-0"
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
						<span className="flex-1 font-medium">Mi perfil</span>
						<svg
							className="h-4 w-4 flex-shrink-0 opacity-40"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
					<a
						href="/cursos"
						className="mobile-auth-link flex items-center gap-3 py-3 text-base text-[#37443a]"
					>
						<svg
							className="h-5 w-5 flex-shrink-0"
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
						<span className="flex-1 font-medium">Mis cursos</span>
						<svg
							className="h-4 w-4 flex-shrink-0 opacity-40"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
					<a
						href="/auth/logout"
						className="mobile-auth-link mt-2 flex items-center gap-3 py-3 text-base text-red-600"
					>
						<svg
							className="h-5 w-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						<span className="flex-1 font-medium">Cerrar sesión</span>
					</a>
				</>
			) : (
				<>
					<p className="font-display mb-3 text-lg text-[#37443a]/80">¡Únete a la tribu!</p>
					<a
						href="/auth/login"
						className="mobile-auth-link inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#37443a] bg-transparent px-6 py-3 text-base font-semibold text-[#37443a] transition-all hover:bg-[#37443a] hover:text-white"
					>
						Iniciar sesión
					</a>
					<a
						href="/auth/register"
						className="mobile-auth-link inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#B85440] to-[#D88B7D] px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
					>
						Regístrate gratis
					</a>
				</>
			)}
		</div>
	)
}
