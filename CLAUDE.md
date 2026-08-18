# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm type-check` - Run TypeScript type checking without emitting files
- `pnpm prettier` - Format code with Prettier
- `pnpm lint:style` - Run Stylelint with auto-fix for CSS files
- `pnpm lint:secret` - Check for secrets in files with masking
- `pnpm secretlint` - Check for secrets in files

## Architecture Overview

This is a multilingual (English/Japanese) Next.js 15 blog/portfolio website using the App Router with the following key architectural patterns:

### Internationalization (i18n)

- Uses `next-intl` for internationalization with locale routing (`/en`, `/ja`)
- Locale configuration in `src/i18n/routing.ts` with English as default
- Markdown content is organized by locale in `src/markdown-pages/[locale]/`
- Uses locale-aware metadata generation

### File Structure

- **App Router**: `src/app/[locale]/` contains all pages with locale-based routing
- **Components**: Each page has its own `_components/` directory with co-located CSS modules
- **Markdown Content**: Blog posts stored as `.md` files in `src/markdown-pages/[locale]/`
- **Shared Libraries**: Common utilities in `src/libs/`
- **Styling**: CSS Modules with `.module.css` files co-located with components

### Key Technical Features

- **Blog System**: Markdown-based blog with parsing using `parse-md` and `react-markdown`
- **Contact Form**: Uses React Hook Form with reCAPTCHA and Nodemailer
- **Analytics**: Vercel Analytics and Speed Insights, Umami, and Hotjar. Umami's tracker and collection endpoint are proxied through `/stats/*` by the rewrites in `vercel.json`, so the site's own domain serves them. Hotjar waits for the first click, scroll, or touch before loading
- **Environment Management**: Type-safe environment variables using `@t3-oss/env-nextjs`
- **Image Handling**: Next.js Image component with AVIF and WebP output; `remotePatterns` lists the hosts portfolio thumbnails may come from

### Development Tools

- **Git Hooks**: Lefthook configuration runs ESLint, Prettier, Stylelint, TypeScript, and Secretlint on pre-commit
- **Code Quality**: Comprehensive ESLint config with security, perfectionist, and import plugins
- **Type Safety**: Strict TypeScript with `@total-typescript/ts-reset` and custom type definitions

### Styling Approach

- CSS Modules for component-specific styles
- Global styles in `src/app/[locale]/globals.css`
- Custom Japanese font (JKG) split into two `unicode-range` subsets by `pnpm font:subset`;
  the common set loads on every page and the rest only when a rare kanji appears
- Responsive design with mobile menu component

## Important Notes

- The site uses markdown files for blog content - posts are date-prefixed (YYYYMMDD format)
- Environment variables are required for analytics, contact form, and reCAPTCHA functionality
- All user-facing text should be internationalized through the next-intl system
- CSS classes should follow the existing CSS Modules pattern with co-located styles

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
