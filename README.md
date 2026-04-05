# kk-web

A multilingual personal blog and portfolio website built with Next.js 15, featuring English and Japanese content.

## Features

- 📝 **Markdown-based Blog** - Write posts in Markdown with date-based organization
- 🌍 **Internationalization** - Full English/Japanese localization with next-intl
- 📱 **Responsive Design** - Mobile-first design with CSS Modules
- 📧 **Contact Form** - Integrated contact form with reCAPTCHA protection
- 📊 **Analytics** - Hotjar, Vercel Analytics, and Umami
- 🎨 **Portfolio Sections** - Showcase applications, web services, NPM packages, and more
- 🔒 **Security** - Comprehensive linting with security rules and secret detection
- 🎯 **Performance** - Turbopack for fast development, static optimization
- 🌙 **Theme Support** - Dark/light theme switching with next-themes

## Tech Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Runtime**: Node.js 20+ (required for React 19)
- **Styling**: CSS Modules with Stylelint
- **Internationalization**: next-intl with locale routing
- **Content**: Markdown parsing with react-markdown, remark-gfm, and rehype-raw
- **Forms**: React Hook Form with Zod validation and reCAPTCHA
- **Analytics**: Hotjar, Vercel Analytics, and Umami
- **Email**: Nodemailer for contact form
- **Development**: TypeScript, ESLint with security plugins, Prettier
- **Deployment**: Vercel with static optimization

## Getting Started

### Prerequisites

- Node.js 20+ (required for React 19)
- npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables (create `.env.local` with the following variables):

```env
# Hotjar Analytics
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
NEXT_PUBLIC_HOTJAR_SV=your_hotjar_version

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Nodemailer (Contact Form)
NODEMAILER_AUTH_USER=your_email_address
NODEMAILER_AUTH_PASS=your_email_app_password
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Development

### Available Commands

**Development:**

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server

**Code Quality:**

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm prettier` - Format code with Prettier
- `pnpm lint:style` - Run Stylelint with auto-fix for CSS files

**Security:**

- `pnpm lint:secret` - Check for secrets with masking
- `pnpm secretlint` - Check for secrets in files

**Other:**

- `pnpm lighthouse` - Run Lighthouse CI for performance testing

### Adding Blog Posts

Create markdown files in `src/markdown-pages/[locale]/` with the format `YYYYMMDD.md`:

```markdown
---
title: "Your Post Title"
description: "Post description"
---

Your markdown content here...
```

### Project Structure

```
src/
├── app/[locale]/          # Localized pages with App Router
│   ├── _components/       # Page-specific components
│   └── globals.css        # Global styles
├── markdown-pages/        # Blog content organized by locale
│   ├── en/               # English blog posts (YYYYMMDD.md)
│   └── ja/               # Japanese blog posts (YYYYMMDD.md)
├── libs/                  # Shared utilities and helper functions
├── i18n/                  # Internationalization configuration
└── env.ts                 # Type-safe environment variables
```

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy
