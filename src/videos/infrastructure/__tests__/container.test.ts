/**
 * Video Service Tests - Demonstrating Dependency Injection
 */
import { afterEach, describe, expect, it } from "vitest"

import type { VideoProvider } from "../../domain/ports/video-provider.port"
import type { Video, VideoResult } from "../../domain/video.types"
import { MockVideoProvider } from "../../providers/mock/mock.provider"
import {
	getVideo,
	getVideoProvider,
	injectVideoProvider,
	listVideos,
	resetVideoProvider,
} from "../container"

// Mock provider for testing
class TestVideoProvider implements VideoProvider {
	async getVideo(videoId: string): Promise<VideoResult<Video>> {
		return {
			data: {
				id: videoId,
				title: "Test Video",
				description: "This is a test",
				duration: 100,
				thumbnailUrl: "https://example.com/thumb.jpg",
				courseId: "test-course",
				chapterIndex: 1,
				metadata: {},
				createdAt: new Date(),
				status: "ready",
			},
			error: null,
		}
	}

	async listVideos(): Promise<VideoResult<Video[]>> {
		return {
			data: [],
			error: null,
		}
	}
}

describe("VideoService - Dependency Injection", () => {
	afterEach(() => {
		// Reset provider after each test
		resetVideoProvider()
	})

	it("should use default provider from environment", async () => {
		const provider = getVideoProvider()
		expect(provider).toBeInstanceOf(MockVideoProvider)
	})

	it("should allow injecting custom provider", async () => {
		// Inject test provider
		injectVideoProvider(new TestVideoProvider())

		const { data } = await getVideo("custom-video-id")
		expect(data).toBeDefined()
		expect(data?.title).toBe("Test Video")
		expect(data?.id).toBe("custom-video-id")
	})

	it("should reset provider correctly", async () => {
		// Inject custom provider
		injectVideoProvider(new TestVideoProvider())
		let { data } = await getVideo("test-id")
		expect(data?.title).toBe("Test Video")

		// Reset to default
		resetVideoProvider()

		// Should re-initialize from env (mock by default)
		const result = await getVideo("mock-video-1")
		expect(result.data?.title).toBe("Introducción al FemmBarre")
	})

	it("should allow switching providers at runtime", async () => {
		// Start with test provider
		injectVideoProvider(new TestVideoProvider())
		let { data } = await getVideo("test-1")
		expect(data?.title).toBe("Test Video")

		// Switch to mock provider
		injectVideoProvider(new MockVideoProvider())
		const result = await getVideo("mock-video-1")
		expect(result.data?.title).toBe("Introducción al FemmBarre")
	})

	it("should lazy initialize provider on first use", async () => {
		// Don't inject anything, just use it
		const { data } = await getVideo("mock-video-1")
		expect(data).toBeDefined()
		expect(data?.id).toBe("mock-video-1")
	})
})

describe("VideoService - listVideos", () => {
	afterEach(() => {
		resetVideoProvider()
	})

	describe("basic listing", () => {
		it("should list all videos", async () => {
			const { data, error } = await listVideos()

			expect(error).toBeNull()
			expect(data).toBeDefined()
			expect(Array.isArray(data)).toBe(true)
			expect(data!.length).toBeGreaterThan(0)
		})

		it("should return videos with all required fields", async () => {
			const { data } = await listVideos()

			expect(data![0]).toHaveProperty("id")
			expect(data![0]).toHaveProperty("title")
			expect(data![0]).toHaveProperty("description")
			expect(data![0]).toHaveProperty("duration")
			expect(data![0]).toHaveProperty("thumbnailUrl")
			expect(data![0]).toHaveProperty("courseId")
			expect(data![0]).toHaveProperty("chapterIndex")
			expect(data![0]).toHaveProperty("metadata")
			expect(data![0]).toHaveProperty("createdAt")
			expect(data![0]).toHaveProperty("status")
		})
	})

	describe("filtering by courseId", () => {
		it("should filter videos by courseId", async () => {
			const { data } = await listVideos({ courseId: "femmbarre-intro" })

			expect(data).toBeDefined()
			expect(data!.length).toBeGreaterThan(0)
			expect(data!.every((v) => v.courseId === "femmbarre-intro")).toBe(true)
		})

		it("should return empty array for non-existent course", async () => {
			const { data } = await listVideos({ courseId: "non-existent-course" })

			expect(data).toBeDefined()
			expect(data!.length).toBe(0)
		})

		it("should return videos from different courses separately", async () => {
			const intro = await listVideos({ courseId: "femmbarre-intro" })
			const advanced = await listVideos({ courseId: "femmbarre-advanced" })

			expect(intro.data!.length).toBeGreaterThan(0)
			expect(advanced.data!.length).toBeGreaterThan(0)
			expect(intro.data![0].courseId).not.toBe(advanced.data![0].courseId)
		})
	})

	describe("filtering by status", () => {
		it("should filter videos by status", async () => {
			const { data } = await listVideos({ status: "ready" })

			expect(data).toBeDefined()
			expect(data!.length).toBeGreaterThan(0)
			expect(data!.every((v) => v.status === "ready")).toBe(true)
		})

		it("should return processing videos", async () => {
			const { data } = await listVideos({ status: "processing" })

			expect(data).toBeDefined()
			// mock-video-8 is processing
			if (data!.length > 0) {
				expect(data!.every((v) => v.status === "processing")).toBe(true)
			}
		})

		it("should return error videos", async () => {
			const { data } = await listVideos({ status: "error" })

			expect(data).toBeDefined()
			// May be empty in mock data
			expect(Array.isArray(data)).toBe(true)
		})
	})

	describe("filtering by date range", () => {
		it("should filter videos from a specific date onwards", async () => {
			const fromDate = new Date("2024-01-17")
			const { data } = await listVideos({ from_date: fromDate })

			expect(data).toBeDefined()
			expect(data!.every((v) => v.createdAt >= fromDate)).toBe(true)
		})

		it("should filter videos up to a specific date", async () => {
			const toDate = new Date("2024-01-17")
			const { data } = await listVideos({ to_date: toDate })

			expect(data).toBeDefined()
			expect(data!.every((v) => v.createdAt <= toDate)).toBe(true)
		})

		it("should filter videos within a date range", async () => {
			const fromDate = new Date("2024-01-16")
			const toDate = new Date("2024-01-19")
			const { data } = await listVideos({ from_date: fromDate, to_date: toDate })

			expect(data).toBeDefined()
			expect(data!.every((v) => v.createdAt >= fromDate && v.createdAt <= toDate)).toBe(true)
		})

		it("should return empty array for future date range", async () => {
			const fromDate = new Date("2025-01-01")
			const { data } = await listVideos({ from_date: fromDate })

			expect(data).toBeDefined()
			expect(data!.length).toBe(0)
		})

		it("should handle exact date matches", async () => {
			const exactDate = new Date("2024-01-15")
			const { data } = await listVideos({ from_date: exactDate, to_date: exactDate })

			expect(data).toBeDefined()
			// Should include videos created on 2024-01-15
		})
	})

	describe("combined filters", () => {
		it("should combine courseId and status filters", async () => {
			const { data } = await listVideos({
				courseId: "femmbarre-intro",
				status: "ready",
			})

			expect(data).toBeDefined()
			expect(data!.every((v) => v.courseId === "femmbarre-intro" && v.status === "ready")).toBe(
				true
			)
		})

		it("should combine courseId and date range filters", async () => {
			const fromDate = new Date("2024-01-16")
			const toDate = new Date("2024-01-19")
			const { data } = await listVideos({
				courseId: "femmbarre-intro",
				from_date: fromDate,
				to_date: toDate,
			})

			expect(data).toBeDefined()
			expect(
				data!.every(
					(v) =>
						v.courseId === "femmbarre-intro" && v.createdAt >= fromDate && v.createdAt <= toDate
				)
			).toBe(true)
		})

		it("should combine all filters", async () => {
			const fromDate = new Date("2024-01-16")
			const toDate = new Date("2024-01-19")
			const { data } = await listVideos({
				courseId: "femmbarre-intro",
				status: "ready",
				from_date: fromDate,
				to_date: toDate,
			})

			expect(data).toBeDefined()
			expect(
				data!.every(
					(v) =>
						v.courseId === "femmbarre-intro" &&
						v.status === "ready" &&
						v.createdAt >= fromDate &&
						v.createdAt <= toDate
				)
			).toBe(true)
		})
	})

	describe("sorting", () => {
		it("should sort videos by chapter index", async () => {
			const { data } = await listVideos({ courseId: "femmbarre-intro" })

			expect(data).toBeDefined()

			// Check if sorted by chapterIndex
			for (let i = 0; i < data!.length - 1; i++) {
				if (data![i].chapterIndex !== null && data![i + 1].chapterIndex !== null) {
					expect(data![i].chapterIndex!).toBeLessThanOrEqual(data![i + 1].chapterIndex!)
				}
			}
		})

		it("should sort by creation date when no chapter index", async () => {
			const { data } = await listVideos()

			expect(data).toBeDefined()
			// Videos should be in chronological order (by chapter or date)
		})
	})

	describe("pagination", () => {
		it("should limit the number of results", async () => {
			const { data } = await listVideos({ limit: 3 })

			expect(data).toBeDefined()
			expect(data!.length).toBeLessThanOrEqual(3)
		})

		it("should offset results", async () => {
			const page1 = await listVideos({ limit: 2, offset: 0 })
			const page2 = await listVideos({ limit: 2, offset: 2 })

			expect(page1.data).toBeDefined()
			expect(page2.data).toBeDefined()

			if (page1.data!.length > 0 && page2.data!.length > 0) {
				expect(page1.data![0].id).not.toBe(page2.data![0].id)
			}
		})

		it("should handle offset beyond available videos", async () => {
			const { data } = await listVideos({ offset: 1000 })

			expect(data).toBeDefined()
			expect(data!.length).toBe(0)
		})

		it("should paginate filtered results", async () => {
			const { data } = await listVideos({
				courseId: "femmbarre-intro",
				limit: 2,
				offset: 0,
			})

			expect(data).toBeDefined()
			expect(data!.length).toBeLessThanOrEqual(2)
			expect(data!.every((v) => v.courseId === "femmbarre-intro")).toBe(true)
		})
	})

	describe("edge cases", () => {
		it("should handle empty options", async () => {
			const { data } = await listVideos({})

			expect(data).toBeDefined()
			expect(Array.isArray(data)).toBe(true)
		})

		it("should handle undefined options", async () => {
			const { data } = await listVideos(undefined)

			expect(data).toBeDefined()
			expect(Array.isArray(data)).toBe(true)
		})

		it("should handle limit of 0 (returns empty array)", async () => {
			const { data } = await listVideos({ limit: 0 })

			expect(data).toBeDefined()
			expect(data!.length).toBe(0)
		})

		it("should handle negative offset (treated as 0)", async () => {
			const { data } = await listVideos({ offset: -1 })

			expect(data).toBeDefined()
			// Should return results from start
		})
	})
})
