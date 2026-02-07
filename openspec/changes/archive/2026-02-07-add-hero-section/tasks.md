# Tasks: add-hero-section

## Implementation Checklist

### Design Tokens
- [x] **Task 1**: Add font size token for hero title (responsive clamp with 40px max: `--font-size-hero-title`)
- [x] **Task 2**: Add font size token for hero subtitle (responsive clamp with 32px max: `--font-size-hero-subtitle`)
- [x] **Task 3**: Add color token for hero title (dark gray #242424: `--color-dark-gray`)
- [x] **Task 4**: Add color token for hero subtitle (medium gray #999: `--color-medium-gray`)

### Hero Component Structure
- [x] **Task 5**: Create Hero.tsx with TypeScript props (variant, bgImage, mobileBgImage, title, subtitle, overlay)
- [x] **Task 6**: Implement desktop variant prop handling (tall: 1920×820, short: 1920×500)
- [x] **Task 7**: Add mobile-specific background image with desktop fallback logic
- [x] **Task 8**: Import Next.js Image and Link components

### Styling
- [x] **Task 9**: Create hero.css with base .Hero-root styles
- [x] **Task 10**: Add variant styles (.Hero-root--tall, .Hero-root--short) for desktop aspect ratios
- [x] **Task 11**: Add mobile responsive layout (@media max-width 767px)
- [x] **Task 12**: Implement title/subtitle container with left alignment and vertical centering
- [x] **Task 13**: Add responsive x-padding for desktop (max --space-256) and mobile (max --space-32)
- [x] **Task 14**: Style title and subtitle with new font size tokens, --space-20 gap, conditional color styling (white with overlay, dark gray/medium gray without overlay), and font weights (title: 600, subtitle: 400)

### Overlay Support
- [x] **Task 15**: Add conditional overlay rendering (desktop: overlay.png, mobile: overlay-mb.png)
- [x] **Task 16**: Implement overlay styling with proper z-index and positioning

### Accessibility
- [x] **Task 17**: Add semantic HTML (section, h1 for title, p for subtitle)
- [x] **Task 18**: Ensure proper heading hierarchy and alt text for images
- [x] **Task 19**: Verify color contrast for white text on backgrounds (WCAG AA)

### Testing
- [x] **Task 20**: Create Hero.test.tsx with unit tests (variant rendering, image fallback, overlay)
- [x] **Task 21**: Test responsive behavior (desktop/mobile breakpoints)
- [x] **Task 22**: Test overlay rendering (with/without overlay, correct image per breakpoint)

### Validation
- [x] **Task 23**: Test build (pnpm build) - no errors
- [x] **Task 24**: Test all tests pass (pnpm test) - 100% passing
- [x] **Task 25**: Validate OpenSpec (openspec validate add-hero-section --strict)

### Hero Page Instances
- [x] **Task 26**: Implement Hero on Home page (tall variant, home-hero.jpg, with overlay, title/subtitle)
- [x] **Task 27**: Implement Hero on See Our Food page (short variant, see-our-food-hero.jpg, with overlay, title/subtitle)
- [x] **Task 28**: Implement Hero on Locations page (short variant, our-locations-hero.png, with overlay, title/subtitle)
- [x] **Task 29**: Implement Hero on News page (short variant, news-hero.png desktop + news-hero-mb.png mobile, with overlay, title/subtitle)
