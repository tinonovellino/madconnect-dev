# MadConnect Website Connectors Page

High-level React + TypeScript app that powers the MadConnect Connectors page. It fetches connector data, renders listings and details, and includes UI elements like filters, search, and documentation rendering.

## Running Locally

1. Install dependencies:
   - `yarn install`
2. Start the dev server:
   - `yarn dev`
3. Build for production:
   - `yarn build`
4. Preview the production build:
   - `yarn preview`

## Structure (High Level)

- `src/`: Application source (pages, components, hooks, and config).
- `public/`: Static assets served as-is.
- `index.html`: App entry HTML for Vite.
- `vite.config.ts`: Vite build and dev server configuration.

## App Configuration (Project-Specific)

- `src/config.ts`: Centralized runtime configuration (API base URLs, feature flags, and app-level settings).
- `constants/index.ts`: Shared constants used across the app (UI defaults, mapping tables, and identifiers).

## Environment Recommendation

Values in `src/config.ts` and `constants/index.ts` that vary by environment should be moved to `.env` files or an injected configuration system (e.g., CI/CD variables). This keeps environment-specific data out of source control and makes deployments safer and more flexible.

## Notes

- This repo uses Vite for development and builds. Tooling configs like `vite.config.ts`, `tsconfig*.json`, and `biome.json` are standard and should be maintained by whoever owns the build pipeline.
