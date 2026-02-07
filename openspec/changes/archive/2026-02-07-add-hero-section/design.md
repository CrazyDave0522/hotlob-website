# Design: add-hero-section

## Architecture Overview

The Hero component is a reusable, responsive section component that displays a full-width background image with optional overlay and left-aligned text content. It supports two desktop variants and a unified mobile layout.

## Component Structure

### Props Interface

```typescript
interface HeroProps {
  variant: "tall" | "short"; // Desktop aspect ratio variant
  bgImage: string; // Desktop background image URL/path
  mobileBgImage?: string; // Optional mobile background image
  title: string; // Hero title (semantic h1)
  subtitle: string; // Hero subtitle (semantic p)
  overlay?: boolean; // Whether to apply overlay
}
```

### Component Implementation

**Hero.tsx structure:**

1. Accept variant, bgImage, mobileBgImage, title, subtitle, overlay props
2. Use Next.js Image component for background images
3. Implement mobile fallback: use mobileBgImage if provided, else bgImage
4. Conditionally render overlay layer (desktop: overlay.png, mobile: overlay-mb.png)
5. Render text content with semantic HTML (h1 for title)
6. Apply BEM classes with variant modifiers

## Responsive Design

### Desktop Breakpoints (≥ 768px)

**Tall variant (1920×820 aspect ratio)**

- Background: responsive width to viewport, height scales maintaining 820/1920 ratio
- Container height: clamp-based or aspect-ratio CSS

**Short variant (1920×500 aspect ratio)**

- Background: responsive width to viewport, height scales maintaining 500/1920 ratio

**Text positioning:**

- X-padding: responsive clamp for left padding with right padding at 1.5x the left value
- Vertically centered: flexbox centering or absolute positioning with transform
- No y-padding (content height doesn't force spacing)

### Mobile Breakpoint (< 768px)

**Mobile layout (750×420 aspect ratio)**

- Same responsive scaling for both variants (unified mobile layout)
- Background: responsive width to viewport, height scales maintaining 420/750 ratio

**Text positioning:**

- X-padding: responsive clamp for left padding with right padding at 1.5x the left value
- Vertically centered (same approach as desktop)

### Responsive X-Padding Calculation

**Desktop (max 256px at 1920px):**

- Left padding formula: clamp(16px, 13.33vw, 256px)
- Right padding formula: calc(left padding × 1.5)
- At 767px: 13.33vw × 767px = 102px (still scaling)
- At 1920px: 13.33vw × 1920px = 256px ✓

**Mobile (max 32px):**

- Left padding formula: clamp(8px, 4.17vw, 32px)
- Right padding formula: calc(left padding × 1.5)
- At viewport width where 4.17vw = 32px: 32/4.17 ≈ 767px (upper bound)

## Styling Approach (CSS)

### Class Structure

```css
.Hero-root {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.Hero-root--tall {
  aspect-ratio: 1920 / 820; /* or height: auto; background-size approach */
}

.Hero-root--short {
  aspect-ratio: 1920 / 500;
}

.Hero-bgImage {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.Hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.Hero-content {
  position: relative;
  z-index: 3;
  --hero-pad-x: clamp(16px, 13.33vw, 256px);
  padding-left: var(--hero-pad-x);
  padding-right: calc(var(--hero-pad-x) * 1.5);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.Hero-textContainer {
  display: flex;
  flex-direction: column;
  gap: var(--space-20); /* gap between title and subtitle */
}

.Hero-title {
  font-size: var(--font-size-hero-title);
  font-weight: 600; /* semibold */
  color: var(--color-white); /* default with overlay */
  margin: 0;
}

.Hero-root--no-overlay .Hero-title {
  color: var(--color-dark-gray); /* #242424 when no overlay */
}

.Hero-subtitle {
  font-size: var(--font-size-hero-subtitle);
  font-weight: 400; /* normal */
  color: var(--color-white); /* default with overlay */
  margin: 0;
}

.Hero-root--no-overlay .Hero-subtitle {
  color: var(--color-medium-gray); /* #999 when no overlay */
}

@media (max-width: 767px) {
  .Hero-root--tall,
  .Hero-root--short {
    aspect-ratio: 750 / 420;
  }

  .Hero-content {
    --hero-pad-x: clamp(8px, 4.17vw, 32px);
    padding-left: var(--hero-pad-x);
    padding-right: calc(var(--hero-pad-x) * 1.5);
  }
}
```

## New Design Tokens

### Typography

**Hero Title Token:**

```css
--font-size-hero-title: clamp(32px, 2.08vw, 40px);
```

- Min: 32px (readable on small screens)
- Responsive: 2.08vw (scales with viewport)
- Max: 40px (at 1920px+ viewport, reaches 40px)
- Mobile override: clamp(24px, 4.17vw, 32px) (reaches 32px at 767px)

**Hero Subtitle Token:**

```css
--font-size-hero-subtitle: clamp(24px, 1.67vw, 32px);
```

- Min: 24px (readable on small screens)
- Responsive: 1.67vw (scales with viewport)
- Max: 32px (at 1920px+ viewport, reaches 32px)
- Mobile override: clamp(16px, 2.61vw, 20px) (reaches 20px at 767px)

### Text Colors (Conditional)

**Hero Title Color (No Overlay):**

```css
--color-dark-gray: #242424;
```

- Used when overlay is disabled
- Dark gray for contrast over light backgrounds

**Hero Subtitle Color (No Overlay):**

```css
--color-medium-gray: #999;
```

- Used when overlay is disabled
- Medium gray for distinction from title

**With Overlay:**

- Both title and subtitle use `--color-white` for contrast over dark overlay

## Mobile Image Fallback Logic

```javascript
// In Hero component
const imageSource = mobileBgImage && isMobileViewport ? mobileBgImage : bgImage;
```

- Check for mobileBgImage prop at runtime (not build-time)
- Continue to use desktop image on larger viewports
- Simplifies page-level usage (can pass both, component handles fallback)

## Overlay Rendering

**Desktop (≥ 768px):**

- Use: `public/images/hero-bg/overlay.png`
- Position: Absolute, z-index 2 (between background and content)

**Mobile (< 768px):**

- Use: `public/images/hero-bg/overlay-mb.png`
- Position: Same, but image is mobile-optimized

**No overlay:**

- Skip overlay layer entirely if `overlay` prop is false/undefined

## Accessibility Considerations

- **Semantic HTML**: `<section>`, `<h1>` for title, `<p>` for subtitle
- **Color contrast**: White text on implied background (images), test WCAG AA
- **Screen readers**: Skip decorative overlay images (alt=""), keep hero text semantic
- **Focus management**: If interactive elements added, ensure keyboard navigation
