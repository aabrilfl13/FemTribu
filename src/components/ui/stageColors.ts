/**
 * Single source of the per-"stage" colour classes.
 * Reused by ServiceMotif, ServiceDetail, OfferCard, FeatureList,
 * Eyebrow, SectionHeading and the /servicios hub.
 */
export type TintColor = "terracotta" | "coral" | "sage" | "forest" | "accent"
/** Only the 4 stages that have a brand motif (ServiceMotif has no "accent"). */
export type StageColor = "terracotta" | "coral" | "sage" | "forest"

export interface Tint {
	/** text / stroke colour (text-*) */
	text: string
	/** solid dot (bg-*) */
	dot: string
	/** soft panel / marker background */
	soft: string
	/** card border */
	border: string
	/** border hover */
	hover: string
	/** chip / eyebrow (bg + text) */
	chip: string
	/** solid badge (bg + text) */
	badge: string
}

export const STAGE: Record<TintColor, Tint> = {
	terracotta: {
		text: "text-terracotta",
		dot: "bg-terracotta",
		soft: "bg-terracotta/10",
		border: "border-terracotta/20",
		hover: "hover:border-terracotta/40",
		chip: "bg-terracotta/15 text-terracotta-dark",
		badge: "bg-terracotta text-cream",
	},
	coral: {
		text: "text-coral",
		dot: "bg-coral",
		soft: "bg-coral/10",
		border: "border-coral/20",
		hover: "hover:border-coral/40",
		chip: "bg-coral/15 text-terracotta-dark",
		badge: "bg-coral text-cream",
	},
	sage: {
		text: "text-sage",
		dot: "bg-sage",
		soft: "bg-sage/12",
		border: "border-sage/25",
		hover: "hover:border-sage/45",
		chip: "bg-sage/20 text-forest",
		badge: "bg-sage text-cream",
	},
	forest: {
		text: "text-forest",
		dot: "bg-forest",
		soft: "bg-forest/10",
		border: "border-forest/20",
		hover: "hover:border-forest/40",
		chip: "bg-forest/10 text-forest",
		badge: "bg-forest text-cream",
	},
	accent: {
		text: "text-accent",
		dot: "bg-accent",
		soft: "bg-accent/10",
		border: "border-accent/20",
		hover: "hover:border-accent/40",
		chip: "bg-accent/10 text-accent",
		badge: "bg-accent text-accent-foreground",
	},
}
