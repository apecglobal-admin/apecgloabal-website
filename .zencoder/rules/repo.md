# Repository Guidelines

## Overview
This document provides a quick reference for the project structure and development practices used in the Apec Global website repository.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript / JavaScript (strict mode where possible)
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: PostgreSQL accessed via server utilities in `lib/db.ts`
- **Runtime**: Node.js (PNPM for package management)

## Key Directories
- **app/**: Next.js App Router routes and API endpoints (`app/api/...`)
- **components/**: Shared UI components and client-side widgets
- **lib/**: Database helpers, utility functions, shared logic
- **public/**: Static assets (images, videos, fonts)
- **prisma/** or **supabase/** (if present): Database schemas or migrations

## Data Flow Notes
- API routes under `app/api/*` should return JSON objects with `{ success, data, total }` structure when possible.
- Database access should go through helper functions in `lib/db.ts`. Reuse query helpers to ensure consistent joins with `companies` for project data.
- Featured projects are served by `/api/projects/featured`. Homepage components fetch from `/api/projects` with `featured=true` filters.

## Frontend Practices
- Prefer server components for data fetching; use client components only for interactivity.
- Ensure responsive behavior using Tailwind CSS breakpoints (`xs`, `sm`, `md`, `lg`, `xl`).
- Keep translations and localized text consistent (Vietnamese primary).
- Use type-safe props when possible; declare interfaces/types at component top.

## Workflows
1. **Install dependencies**: `pnpm install`
2. **Development server**: `pnpm dev`
3. **Linting** (if configured): `pnpm lint`
4. **Testing** (if configured): `pnpm test`

## Additional Notes
- Maintain consistent error handling with `try/catch` blocks in async functions.
- When adding new API routes, validate required fields and return meaningful errors.
- Avoid hard-coded placeholder content when database fields are available.
- Keep fallback UI minimal; prefer showing or hiding sections conditionally based on available data.