# kk-web

A multilingual personal blog and portfolio website built with Next.js 15, featuring English and Japanese content.

## Features

- 📝 **Markdown-based Blog** - Write posts in Markdown with date-based organization
- 🌍 **Internationalization** - Full English/Japanese localization with next-intl
- 📱 **Responsive Design** - Mobile-first design with CSS Modules
- 📧 **Contact Form** - Integrated contact form with reCAPTCHA protection
- 📊 **Analytics** - Google Analytics, Hotjar, LogRocket, and Vercel Analytics
- 🎨 **Portfolio Sections** - Showcase applications, web services, NPM packages, and more

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: CSS Modules
- **Internationalization**: next-intl
- **Content**: Markdown with react-markdown
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Google Analytics, Hotjar, LogRocket
- **Email**: Nodemailer
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (copy `.env.example` to `.env.local` and fill in values):

```env
GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
NEXT_PUBLIC_HOTJAR_SV=your_hotjar_version
NEXT_PUBLIC_LOG_ROCKET_APP_ID=your_logrocket_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
NODEMAILER_AUTH_USER=your_email
NODEMAILER_AUTH_PASS=your_email_password
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Development

### Available Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run prettier` - Format code with Prettier

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
├── app/[locale]/          # Localized pages
├── markdown-pages/        # Blog content by locale
├── libs/                  # Shared utilities
└── i18n/                  # Internationalization config
```

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy

The site uses static image optimization (`unoptimized: true`) for better compatibility with static hosting.
