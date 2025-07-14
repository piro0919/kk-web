# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run prettier` - Format code with Prettier
- `npm run lint:style` - Run Stylelint with auto-fix for CSS files
- `npm run lint:secret` - Check for secrets in files with masking
- `npm run secretlint` - Check for secrets in files

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
- **Analytics**: Integrated Google Analytics, Hotjar, LogRocket, and Vercel Analytics
- **Environment Management**: Type-safe environment variables using `@t3-oss/env-nextjs`
- **Image Handling**: Next.js Image component with unoptimized images for static hosting

### Development Tools

- **Git Hooks**: Lefthook configuration runs ESLint, Prettier, Stylelint, TypeScript, and Secretlint on pre-commit
- **Code Quality**: Comprehensive ESLint config with security, perfectionist, and import plugins
- **Type Safety**: Strict TypeScript with `@total-typescript/ts-reset` and custom type definitions

### Styling Approach

- CSS Modules for component-specific styles
- Global styles in `src/app/[locale]/globals.css`
- Custom Japanese font (JKG) loaded locally
- Responsive design with mobile menu component

## Important Notes

- The site uses markdown files for blog content - posts are date-prefixed (YYYYMMDD format)
- Environment variables are required for analytics, contact form, and reCAPTCHA functionality
- All user-facing text should be internationalized through the next-intl system
- CSS classes should follow the existing CSS Modules pattern with co-located styles
