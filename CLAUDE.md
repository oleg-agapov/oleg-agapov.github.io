# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:4321
npm run build    # static build to ./dist/
npm run preview  # preview production build
```

## Stack

- **Astro 6** — static site generator, outputs zero JS by default
- **Vue 3** — used for interactive islands via `client:only` / `client:load` / `client:visible` directives
- **Tailwind CSS v4** — configured as a Vite plugin (`@tailwindcss/vite`), no `tailwind.config.*` file
- **TypeScript** — strict mode
- **@mlc-ai/web-llm** — on-device LLM inference (runs entirely in the browser via WebGPU)
- **@duckdb/duckdb-wasm** — in-browser SQL engine (WASM) used by the SQL course
- **marked** — markdown rendering inside the chat component
- **@tailwindcss/typography** — prose styles for chat assistant messages

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

- Live URL: `https://oleg-agapov.github.io/`

## Architecture

All pages are statically rendered. Vue components only ship JS when explicitly hydrated with a client directive on the component tag.

### Pages

- `src/pages/index.astro` — homepage with avatar, bio, and the Chat widget
- `src/pages/about.astro` — full bio page (work, teaching, hobbies, contact)
- `src/pages/courses/index.astro` — courses listing page
- `src/pages/courses/sql-fundamentals.astro` — SQL Fundamentals course (mounts `SqlCourse.vue`)
- `src/pages/home.astro` — redirects to `/` (legacy route)

Nav links (rendered in `Base.astro`): **Home**, **About**. Courses link is currently commented out in the nav but the pages exist.

### Chat component (`src/components/Chat.vue`)

The main interactive feature. Mounted with `client:only="vue"` on the homepage. It:
- Loads an on-device LLM (`gemma-2-2b-it-q4f16_1-MLC`) via WebGPU using `@mlc-ai/web-llm`
- Shows a top progress bar while the model downloads/initializes
- Reads the system prompt from `src/data/oleg-context.md` (imported as raw text)
- Streams token-by-token responses and renders them as markdown via `marked`
- Has suggestion pills for quick-start questions

Model can be swapped by changing the `MODEL` constant in `Chat.vue`.

### SQL course component (`src/components/SqlCourse.vue`)

Interactive SQL learning experience. Mounted with `client:only="vue"` on the SQL Fundamentals page. It:
- Initializes DuckDB in the browser via `@duckdb/duckdb-wasm` (no server needed)
- Organizes content into modules → lessons with concept explanations and exercises
- Runs user-submitted SQL queries against the in-browser DuckDB instance
- Validates query results against lesson-specific criteria and tracks per-lesson progress in `localStorage`
- Has a collapsible sidebar for lesson navigation

Uses `CourseLayout.astro` (no nav header) instead of `Base.astro`.

### Service Worker

`public/sw.js` is registered in `Base.astro` and caches assets for offline use.

### Tailwind v4 custom tokens

Defined in `src/styles/global.css` via `@theme {}` — not in a config file:

- Colors: `bg-cream` (`#F7F2EA`), `bg-terra` / `text-terra` (`#D9542B`), `bg-terra-soft` (`#F5D9C9`)
- Fonts: `font-display` (Fraunces), `font-body` (Figtree), `font-mono` (IBM Plex Mono)

These generate utility classes directly — use `font-display`, `text-terra`, etc. in markup. Do not use inline `style` attributes for these.

### Fonts

Loaded from Google Fonts in `global.css`. The three font variables map to the design system:
- `font-display` — headings, nav links (serif, supports italic)
- `font-body` — body text, inputs
- `font-mono` — labels, metadata, uppercase tracking text

### Layout convention

Two layouts exist:
- `src/layouts/Base.astro` — main layout with nav header; used by homepage, about, courses index
- `src/layouts/CourseLayout.astro` — minimal shell without nav; used by course pages for distraction-free learning

Both accept a `title` prop, import `global.css`, and register the service worker.

Static assets (images, icons) go in `public/` and are referenced with the base prefix: `/<filename>`.
