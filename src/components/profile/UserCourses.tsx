import { useEffect, useState } from "react"

interface Course {
	id: string
	title: string
	description: string
	slug: string
	thumbnail?: string
	videoCount?: number
}

interface UserCoursesResponse {
	courses: Course[]
}

export default function UserCourses() {
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function loadCourses() {
			try {
				const response = await fetch("/api/user/me")
				const data: UserCoursesResponse = await response.json()

				if (!response.ok) {
					throw new Error((data as any).error || "Failed to load courses")
				}

				setCourses(data.courses)
			} catch (err) {
				console.error("Error loading courses:", err)
				setError(err instanceof Error ? err.message : "Error al cargar los cursos")
			} finally {
				setLoading(false)
			}
		}

		loadCourses()
	}, [])

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A9582] border-t-transparent"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="rounded-xl bg-red-50 p-6 text-center">
				<p className="text-sm text-red-600">{error}</p>
			</div>
		)
	}

	if (courses.length === 0) {
		return (
			<div className="rounded-xl bg-[#FAF7F5] p-6 text-center">
				<p className="text-muted-foreground text-sm">No estás suscrita a ningún curso</p>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			{courses.map((course) => (
				<a
					key={course.id}
					href={`/cursos/${course.slug}`}
					className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-[#FAF7F5] p-4 transition-all hover:border-[#B85440] hover:shadow-md"
				>
					<div className="rounded-lg bg-white p-2.5 shadow-sm">
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
							></path>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<div className="flex-1">
						<p className="text-primary mb-1 text-sm font-semibold group-hover:text-[#B85440]">
							{course.title}
						</p>
						<p className="text-muted-foreground text-xs">{course.description}</p>
					</div>
					<svg
						className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#B85440]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 5l7 7-7 7"
						></path>
					</svg>
				</a>
			))}
		</div>
	)
}
