# Scroll-Triggered Animations Guide

## How It Works

The scroll animation system uses the **Intersection Observer API** to detect when elements enter the viewport and triggers animations **only once**.

## Setup

### 1. The Utility File

The `src/utils/scrollAnimations.ts` file contains the main logic that:

- Observes elements with the `data-animate` attribute
- Adds animation classes when elements become visible
- Stops observing after animation plays (ensures it only runs once)

### 2. Available Animation Classes

Your project already has these animation utilities in `global.css`:

- `animate-fade-up` - Fades in and moves up
- `animate-fade-in` - Simple fade in
- `animate-slide-in-right` - Slides in from right
- `animate-scale-in` - Scales in from smaller size
- `animate-bounce` - Continuous bounce (use for special elements)

## Usage

### Basic Example

```astro
<div data-animate="animate-fade-up">This content will fade up when scrolled into view</div>

<script>
  import { initScrollAnimations } from "@/utils/scrollAnimations"

  initScrollAnimations()
</script>
```

### With Custom Duration

```astro
<h2 data-animate="animate-fade-up" data-animate-duration="1.5s">Slower animation</h2>
```

### With Custom Delay (for staggered effects)

```astro
<div data-animate="animate-scale-in" data-animate-delay="0s">First</div>
<div data-animate="animate-scale-in" data-animate-delay="0.2s">Second</div>
<div data-animate="animate-scale-in" data-animate-delay="0.4s">Third</div>
```

### Complete Example

```astro
---
// YourComponent.astro
---

<section class="py-20">
  <h2 data-animate="animate-fade-up" data-animate-duration="1s" class="mb-8 text-4xl">Welcome</h2>

  <div class="grid grid-cols-3 gap-4">
    {
      [1, 2, 3].map((item, index) => (
        <div
          data-animate="animate-scale-in"
          data-animate-delay={`${index * 0.2}s`}
          class="card p-6"
        >
          Card {item}
        </div>
      ))
    }
  </div>
</section>

<script>
  import { initScrollAnimations } from "@/utils/scrollAnimations"

  initScrollAnimations()
</script>
```

## Customization

### Adjust Trigger Point

Edit `src/utils/scrollAnimations.ts` to change when animations trigger:

```typescript
const observerOptions = {
  root: null,
  rootMargin: "0px 0px -100px 0px", // Change this value
  threshold: 0.1, // Or this (0.1 = 10% visible)
}
```

- `rootMargin: '0px 0px -100px 0px'` - Triggers 100px before element reaches viewport bottom
- `threshold: 0.1` - Triggers when 10% of element is visible
- `threshold: 0.5` - Would trigger when 50% is visible

### Create New Animation Types

Add to `src/styles/global.css`:

```css
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@utility animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out forwards;
}
```

Then use: `data-animate="animate-slide-in-left"`

## Best Practices

1. **Don't overuse** - Animate key elements, not everything
2. **Stagger animations** - Use delays for groups of elements (0.1s-0.2s apart)
3. **Keep durations reasonable** - 0.6s-1s for most animations
4. **Test on mobile** - Ensure animations don't cause layout issues
5. **Consider reduced motion** - The system respects user preferences automatically

## Migration from Always-On Animations

If you have existing components with `class="animate-fade-up"`:

**Before:**

```astro
<h1 class="animate-fade-up">Title</h1>
```

**After:**

```astro
<h1 data-animate="animate-fade-up">Title</h1>

<script>
  import { initScrollAnimations } from "@/utils/scrollAnimations"

  initScrollAnimations()
</script>
```

## Troubleshooting

### Animations not triggering?

- Ensure you've called `initScrollAnimations()` in your component
- Check that elements have the `data-animate` attribute
- Verify the animation class exists in your CSS

### Animations firing too early/late?

- Adjust `rootMargin` in the observer options
- Try different `threshold` values

### Want to replay animations?

The current implementation plays animations once. To replay, you'd need to modify the utility to not unobserve elements.

## Performance

The Intersection Observer API is very performant and better than scroll event listeners. It:

- Uses browser-native APIs
- Doesn't cause reflows
- Automatically pauses when elements are off-screen
- Works efficiently with many elements
