# Change: Add CSS Infrastructure

## Why

The project has empty CSS files and no global CSS entrypoint wired into the app. We need a consistent CSS structure so custom component styles and Tailwind utilities can scale without ad-hoc imports.

## What Changes

- Add a global CSS entrypoint in app/globals.css that imports Tailwind and project CSS layers in a deterministic order.
- Define token, base, utility, and component CSS layer files and a components index for aggregation.
- Establish a component-prefixed class naming convention to minimize collisions.
- Limit the scope to infrastructure and guiding principles; no production styling is required in this change.

## Impact

- Affected specs: css-architecture (new)
- Affected code: app/globals.css, styles/token.css, styles/components/\*, new styles layer files
