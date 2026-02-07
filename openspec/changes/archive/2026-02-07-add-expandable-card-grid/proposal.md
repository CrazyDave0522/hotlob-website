# Change: Add Expandable Card Grid component

## Why

The Home page needs a reusable, responsive card grid that highlights three key items with an interactive desktop experience and a clear mobile layout.

## What Changes

- Add a reusable `ExpandableCardGrid` component that accepts three items (title + description).
- Provide mobile-first styles so cards stack vertically on mobile and align in a single row on desktop.
- Implement CSS-only hover expansion on desktop so the hovered card expands while the others fold; by default the first card is expanded on desktop, and on mobile cards remain expanded (active) by default.
- Show only the title when a card is inactive; show title and description when active/hovered.
- Use smooth transitions for hover expansion and background changes.
- Ensure the smooth transition reflects the horizontal width change between unhovered and hovered states.
- Apply a fade-in effect to the description when the card is hovered.
- Use card inner padding of `--space-32` on desktop and `--space-20` on mobile.
- Set the gap between title and description to `--space-20`.
- Use white text for active cards and `--color-charcoal` for inactive cards.
- Use `--font-size-h3` for titles and `--font-size-h6` for descriptions on both desktop and mobile.
- Use background images from `public/images/expandable-card-grid` for the three cards, including default, active, and active-mobile variants.
- On desktop, use `cardx.png` when unhovered and `cardx-active.png` when hovered; on mobile use `cardx-active-mb.png`.
- Standardize the stylesheet name to `expandable-card-grid.css` and ensure it is included in component style imports.
- Add the component instance to the Home page under the Hero section.
- Home page instance content:
	- Card 1 title: Our Story
	- Card 1 description: Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.
	- Card 2 title: A quick bite that feels like a treat
	- Card 2 description: Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche — the perfect grab-and-go roll that fits any craving or budget.
	- Card 3 title: 🦞 The Hotlob Hits
	- Card 3 description: ✨ Truffle & Cheese Lobster Roll
		✨ Lemon & Dill Lobster Roll
		✨ Soft Shell Crab Roll
- Add/update tests and snapshots for the new component and Home page usage.

## Impact

- **Affected specs**: page-components
- **Affected code**: components/ExpandableCardGrid.tsx, styles/components/expandable-card-grid.css, styles/components/index.css, app/page.tsx, __tests__/unit/app/components/ (new test)
