/**
 * Video Service Tests - Demonstrating Dependency Injection
 */
import { afterEach, describe, expect, it } from "vitest"

import type { VideoProvider } from "../../domain/ports/video-provider.port"
import type { Video, VideoResult } from "../../domain/video.types"
import { MockVideoProvider } from "../../providers/mock/mock.provider"
import { getVideo, getVideoProvider, injectVideoProvider, resetVideoProvider } from "../container"

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
