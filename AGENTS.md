# Repository Guidelines

## Project Structure & Module Organization

- Primary application lives in `soundsfair-app/` (Next.js 16 + TypeScript + Tailwind, App Router).
  - Routes and pages: `soundsfair-app/app/`
  - Shared UI: `soundsfair-app/components/`
  - Domain logic/utilities: `soundsfair-app/lib/`
  - Markdown content: `soundsfair-app/content/` (lessons, glossary, FAQ)
  - Static assets: `soundsfair-app/public/`
  - Supabase SQL/migrations: `soundsfair-app/supabase/`
- Repo-level materials:
  - Planning/ops docs: `docs/`
  - Source/reference materials: `content-source/` (do not edit casually; large PDFs)
  - Legal templates: `legal-templates/`
  - Netlify config: `netlify.toml` (base dir points to `soundsfair-app`)

## Build, Test, and Development Commands

Run from `soundsfair-app/`:

- `npm install` — install dependencies
- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — production build
- `npm start` — run the production server locally
- `npm run lint` — ESLint (Next.js core-web-vitals + TypeScript config)

Node version is pinned in `soundsfair-app/.nvmrc` (`20.19.6`).

## Coding Style & Naming Conventions

- TypeScript-first; prefer small, typed utilities in `soundsfair-app/lib/`.
- File naming:
  - React components: `PascalCase.tsx`
  - Utilities/modules: `kebab-case.ts`
  - Hooks: `useXyz.ts`
- Keep changes consistent with existing formatting (2-space indentation, double quotes).

## Testing Guidelines

- No automated test runner is currently wired up (no `test` script).
- Use the manual test guide for sync/auth flows: `docs/GUIA_TESTES_SYNC.md`.
- If you add a new test setup, include a clear `npm run test` script and document it here.

## Commit & Pull Request Guidelines

- Use Conventional Commits seen in history: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...` (optional scope like `fix(api): ...`).
- PRs should include: what changed, how to verify (commands/URLs), and screenshots for UI changes.

## Security & Configuration Tips

- Copy env vars: `cp .env.example .env.local` (see `soundsfair-app/.env.example`).
- Never commit secrets (especially `SUPABASE_SERVICE_ROLE_KEY`); prefer Netlify environment variables for production.
