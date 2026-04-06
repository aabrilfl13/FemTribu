import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ locals }) => {
	const user = locals.user

	if (!user) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}

	// TODO: Add logic for paid subscriptions and actual course access
	// For now, always return femmbarre-maternity course
	const courses = [
		{
			id: "femmbarre-maternity",
			title: "FemmBarre Maternity",
			description: "Entrena de forma segura durante y después del embarazo",
			slug: "femmbarre-maternity",
			thumbnail: "/images/courses/femmbarre-maternity-thumb.jpg", // TODO: Add actual thumbnail
			videoCount: 0, // TODO: Get actual count from video provider
		},
	]

	return new Response(JSON.stringify({ courses }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
