## 1. CSS Entry Point
- [x] 1.1 Create a global import order in app/globals.css for Tailwind and project layers.
- [x] 1.2 Add layer files: styles/base.css, styles/utilities.css, styles/components/index.css.

## 2. Token and Component Conventions
- [x] 2.1 Define initial design tokens in styles/token.css using group prefixes (--color-*, --font-size-*, --font-weight-*, --line-height-*, --space-*, --radius-*, --shadow-*, --motion-*). Required tokens: --color-primary (#EA4148), --color-black (#1D1E1F), --color-gray (#4E5969), --color-white (#FFF), --font-size-h1 (clamp(32px, 4vw, 48px)), --font-size-h2 (clamp(24px, 3vw, 36px)), --font-size-h3 (clamp(20px, 2.5vw, 30px)), --font-size-h4 (clamp(18px, 2vw, 24px)), --font-size-h5 (clamp(16px, 1.5vw, 20px)), --font-size-h6 (clamp(14px, 1vw, 18px)), --font-size-body-lg (clamp(18px, 2vw, 20px)), --font-size-body (clamp(16px, 1.5vw, 18px)), --font-size-body-sm (clamp(14px, 1vw, 16px)), --font-size-body-xs (clamp(12px, 0.8vw, 14px)), --font-weight-normal (400), --font-weight-medium (500), --font-weight-semibold (600), --font-weight-bold (700), --line-height-tight (1.2), --line-height-normal (1.4), --line-height-relaxed (1.6), --radius-10 (10px), --radius-20 (20px), --radius-30 (30px), and spacing scale: --space-4 (4px), --space-8 (8px), --space-12 (12px), --space-16 (16px), --space-20 (20px), --space-24 (24px), --space-32 (32px), --space-40 (40px), --space-48 (48px), --space-64 (64px), --space-80 (80px), --space-96 (96px), --space-128 (128px), --space-160 (160px), --space-192 (192px), --space-256 (256px).
- [x] 2.2 Add component class stubs in existing component CSS files using component-prefixed naming (no visual styling required).
- [x] 2.3 Document component naming and import conventions in a short styles README (if needed).

## 3. Validation
- [x] 3.1 Run pnpm build to confirm CSS imports compile.
