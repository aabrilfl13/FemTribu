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
	/** Duration in minutes to snooze the modal after clicking a CTA button */
	snoozeDurationMinutes: number
}

export const storiesConfig: StoriesConfig = {
	enabled: true,
	delayMs: 5000,
	cooldownDays: 1,
	autoAdvance: true,
	storyDuration: 20000,
	snoozeDurationMinutes: 15,
}
