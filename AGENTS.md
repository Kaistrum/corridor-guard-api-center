<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design system — Stratum UI

All UI development in this project MUST follow the Stratum UI design system. Do not hand-roll components, colors, spacing, or typography that the design system already provides — compose from Stratum UI and its design tokens instead.

**Reference:** https://kaistrum.github.io/design-system/?path=/docs/foundations-installation--docs

Consult the foundations (Colors, Typography, Spacing & Layout, Motion, Icons) and the component docs in that Storybook before building any new screen or component.

## Already installed

- Package: `@kaistrum/stratum-ui` (peer deps React 19+, Tailwind v4 — already satisfied).
- Global CSS: `src/styles/globals.css` imports `@kaistrum/stratum-ui/styles/globals.css` and declares `@source` so Tailwind v4 scans the library's utility classes.
- App is wrapped in `<ThemeProvider>` in `src/pages/_app.tsx`. Dark mode is the default; use `useTheme()` for theme state and the `ThemeToggle` component to switch.

## Usage

```tsx
import { Button, Card, Alert } from "@kaistrum/stratum-ui";
```

Prefer Stratum UI primitives (Button, Input, Select, Checkbox, …), feedback (Alert, Badge, Card, …), navigation, layout (Container, Grid, Stack, Section), and organism components over custom markup.

> Note: SF Pro Display must be added manually under `public/fonts/` per the installation guide; Instrument Serif loads from Google Fonts automatically.
