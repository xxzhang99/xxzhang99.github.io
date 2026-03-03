# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRISM (Portfolio & Research Interface Site Maker) is a Next.js 15 personal academic website template. It is **configuration-driven**: all site content lives in `content/` (TOML, Markdown, BibTeX files) with no code changes needed for content updates. The build output is a fully static site (`out/`).

## Commands

```bash
npm run dev      # Start dev server with Turbopack at localhost:3000
npm run build    # Build static export to out/
npm run start    # Serve the built output
npm run lint     # Run ESLint
```

Requires Node.js >= 22.

## Architecture

### Data Flow (Server → Client)

All content loading happens at **build time** on the server. The Next.js pages (`src/app/`) read TOML/Markdown/BibTeX files, then pass the pre-loaded data as props to `*Client.tsx` components which handle client-side rendering and interactivity.

- `src/app/page.tsx` → builds `dataByLocale` map → `HomePageClient.tsx`
- `src/app/[slug]/page.tsx` → builds `dataByLocale` map → `DynamicPageClient.tsx`
- `generateStaticParams()` in `[slug]/page.tsx` generates all routes from `content/config.toml`'s `navigation` entries

### Content Loading (`src/lib/`)

- `src/lib/config.ts` — Loads and merges `content/config.toml` with locale overrides. The `SiteConfig` type is defined here. **i18n config is always sourced from default `content/config.toml` only** (not locale overrides).
- `src/lib/content.ts` — Generic file loader with locale fallback: tries `content_<locale>/filename` first, falls back to `content/filename`.
- `src/lib/bibtexParser.ts` — Parses `.bib` files into `Publication[]` objects.

### I18n System

All content can be localized by mirroring the `content/` structure as `content_<locale>/` (e.g., `content_zh/`). Missing locale files automatically fall back to `content/`.

**Locale resolution at runtime:**
1. A bootstrap `<script>` in `layout.tsx` sets `data-locale` on `<html>` before hydration (prevents flash)
2. `LocaleProvider` initializes `localeStore` (Zustand) from that `data-locale` value
3. `*Client.tsx` components read `locale` from `useLocaleStore` and select from their `dataByLocale` prop

UI strings (not content) are in `src/lib/i18n/messages.ts` with `en` and `zh` built-in.

### Page Types

Pages are driven by TOML config files in `content/`. The `type` field determines rendering:

| Type | Component | Description |
|------|-----------|-------------|
| `about` | `HomePageClient` / sections | Homepage with configurable sections |
| `publication` | `PublicationsList` | BibTeX-sourced list with search/filter |
| `text` | `TextPage` | Markdown rendered with `react-markdown` |
| `card` | `CardPage` | Grid of cards defined inline in TOML |

The `about` page is special: it always renders at `/` (root), not under `/[slug]`. All other `navigation` entries with `type: "page"` become `/[slug]` routes.

### Theme

Theme (light/dark/system) is handled by `next-themes` with a Zustand store (`src/lib/stores/themeStore.ts`). A bootstrap script in `layout.tsx` sets the theme class on `<html>` before hydration.

### Key Config: `content/config.toml`

- `[features].enable_one_page_mode` — Renders all nav pages as sections on the homepage instead of separate routes
- `[features].enable_likes` — Shows a like button on the about page
- `[i18n]` — Controls locale behavior (`enabled`, `locales`, `default_locale`, `mode: "auto"|"fixed"`, `persist`, `switcher`)
- `[[navigation]]` entries with `type: "page"` must have a matching `content/<target>.toml` file

### Adding a New UI Language

To add UI string translations for a new locale, add a new entry to the `messages` object in `src/lib/i18n/messages.ts` following the `LocaleMessages` interface.
