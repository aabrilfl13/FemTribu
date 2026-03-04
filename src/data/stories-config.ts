// Stories Modal Configuration
export interface StoriesConfig {
	/** Whether the stories modal is enabled */
	enabled: boolean
	/** Delay in milliseconds before showing the modal after page load */
	delayMs: number
	/** Number of days before the modal can be shown again after being dismissed */
	cooldownDays: number
	/** Whether stories should auto-advance to the next one */
	autoAdvance: boolean
	/** Duration in milliseconds for each story */
	storyDuration: number
}

export const storiesConfig: StoriesConfig = {
	enabled: true,
	delayMs: 5000, // 5 seconds after page load
	cooldownDays: 7, // Don't show again for 7 days after dismissal
	autoAdvance: true,
	storyDuration: 7000, // 7 seconds per story
}
