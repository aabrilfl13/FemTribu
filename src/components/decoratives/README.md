# Decorative Components

This directory contains reusable decorative components extracted from the AboutMe component. These components allow you to add mystical floating decorations, icon decorations, and decorative containers to any part of your Astro application.

## Components

### 1. `MysticDecoration.astro`

A floating decorative element with various animation types.

**Props:**

- `iconName` (string, required): The name of the icon file (without path or extension)
- `animationType` ("spiral" | "organic" | "fluid" | "side-flow" | "frame-dance" | "bg", required): Type of animation
- `className` (string, optional): Additional CSS classes
- `size` ("small" | "medium" | "large" | "xlarge", default: "medium"): Size of the decoration
- `position` (object, optional): Position styles (top, bottom, left, right)
- `opacity` (number, default: 0.08): Opacity of the decoration
- `animationDuration` (string, default: "40s"): Animation duration
- `animationDirection` ("normal" | "reverse", default: "normal"): Animation direction

**Example:**

```astro
<MysticDecoration
	iconName="01"
	animationType="spiral"
	size="large"
	position={{ top: "10%", right: "5%" }}
	animationDuration="30s"
/>
```

### 2. `IconDecoration.astro`

A circular decorative icon with glow effect, typically used as an accent on images.

**Props:**

- `iconName` (string, required): The name of the icon file (without path or extension)
- `size` ("small" | "medium" | "large", default: "medium"): Size of the decoration
- `className` (string, optional): Additional CSS classes
- `position` (object, default: { bottom: "-25px", right: "-25px" }): Position styles

**Example:**

```astro
<IconDecoration
	iconName="24"
	size="large"
	position={{ bottom: "-30px", right: "-30px" }}
/>
```

### 3. `DecorativeContainer.astro`

A wrapper container that manages decorative elements and their layering.

**Props:**

- `class` (string, optional): CSS classes for the container

**Example:**

```astro
<DecorativeContainer class="my-container has-floating-decorations">
	<!-- Decorative elements -->
	<MysticDecoration ... />

	<!-- Content -->
	<div class="content">
		<h2>Your content here</h2>
	</div>
</DecorativeContainer>
```

## Animation Types

### `spiral`

Rotating spiral movement with scaling effects. Good for cosmic/mystical themes.

### `organic`

Natural, organic movement pattern with 5-point rotation cycle. Great for nature-inspired sections.

### `fluid`

Smooth flowing movement with 360-degree rotation. Perfect for dynamic content areas.

### `side-flow`

Subtle side-to-side movement with rotation. Ideal for sidebar decorations.

### `frame-dance`

Gentle dancing motion suitable for framing content like testimonials.

### `bg`

Subtle background animation for larger decorative elements.

## Size Reference

- **small**: 100px container
- **medium**: 150px container
- **large**: 200px container
- **xlarge**: 300px container

Icon decoration sizes:

- **small**: 70px container, 40px icon
- **medium**: 90px container, 55px icon
- **large**: 110px container, 70px icon

## Usage Patterns

### 1. Floating Background Decorations

Use multiple `MysticDecoration` components with different sizes and animations to create a rich decorative background:

```astro
<DecorativeContainer class="has-floating-decorations">
	<MysticDecoration iconName="01" animationType="spiral" size="large" position={{ top: "8%", right: "3%" }} />
	<MysticDecoration iconName="25" animationType="organic" size="medium" position={{ top: "25%", left: "2%" }} animationDirection="reverse" />
	<MysticDecoration iconName="27" animationType="fluid" size="small" position={{ bottom: "15%", right: "8%" }} />

	<div class="content">
		<!-- Your content here -->
	</div>
</DecorativeContainer>
```

### 2. Image Accent Decoration

Add a floating icon decoration to images:

```astro
<div class="image-wrapper">
	<img src="/images/portrait.jpg" alt="Portrait" />
	<IconDecoration iconName="24" size="medium" />
</div>
```

### 3. Section Frame Decorations

Frame sections with positioned decorations:

```astro
<section class="testimonials-section">
	<MysticDecoration
		iconName="31"
		animationType="frame-dance"
		size="xlarge"
		position={{ top: "-50px", left: "-80px" }}
		opacity={0.05}
	/>

	<!-- Section content -->
</section>
```

## Best Practices

1. **Performance**: Use sparingly - too many animated elements can impact performance
2. **Opacity**: Keep opacity low (0.04-0.12) for subtle background effects
3. **Positioning**: Use absolute positioning with negative margins for edge effects
4. **Responsive**: Decorations automatically hide on mobile devices (< 768px)
5. **Layering**: Use DecorativeContainer to manage z-index properly

## Responsive Behavior

All decorative components automatically hide on screens smaller than 768px to avoid clutter on mobile devices. This is handled by the CSS media query in DecorativeContainer.

## File Structure

```
src/components/
├── MysticDecoration.astro      # Main floating decoration component
├── IconDecoration.astro        # Circular icon decoration with glow
├── DecorativeContainer.astro   # Container wrapper for managing decorations
└── examples/
    └── DecorativeExamples.astro # Usage examples
```

## Available Icons

The components use icons from `/public/images/decoratives/` with the naming pattern `ilustracion-negro_{iconName}.svg`.

Common icon names include: `01`, `09`, `24`, `25`, `26`, `27`, `29-29`, `31`, `33`, `35`

## Customization

You can extend the components by:

1. Adding new animation types in `MysticDecoration.astro`
2. Creating new size variants
3. Adding custom CSS classes through the `className` prop
4. Modifying filter effects for different color themes
