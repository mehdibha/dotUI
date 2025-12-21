# Migration Plan: Next.js → TanStack Start

## Phase 1: Setup & Tooling

### 1. Biome Config
- [ ] Sync with root `biome.json` settings (line width 120, tabs, rules)

### 2. TypeScript
- [ ] Extend from `@dotui/ts-config/base.json`

### 3. Path Aliases
- [ ] Configure `@/` → `src/`
- [ ] Add workspace package paths

### 4. Tailwind CSS v4
- [ ] Set up CSS variables (colors, spacing)
- [ ] Configure dark mode
- [ ] Import custom plugins (`tailwindcss-autocontrast`, `tailwindcss-with`)

### 5. Workspace Packages
- [ ] Add `@dotui/registry`
- [ ] Add `@dotui/core`

### 6. Vitest
- [ ] Configure with jsdom
- [ ] Add testing-library setup

### 7. Environment Variables
- [ ] Set up env loading pattern

---

## Phase 2: Fumadocs Integration

> Using latest fumadocs (core: 16.3.2, mdx: 14.2.2) - independent from www versions
> No fumadocs-ui - using custom layout from www

### 1. source.config.ts
- [ ] Create at root of start/
- [ ] Define `docs` collection → `content/docs`
- [ ] Define `legal` collection → `content/legal` (renamed from "marketing")
- [ ] Configure MDX options (rehype code, themes: github-light/dark)

### 2. Vite Config
- [ ] Add `fumadocs-mdx/vite` plugin (must be before other plugins)
- [ ] Import source.config dynamically: `mdx(await import('./source.config'))`

### 3. Source Loader (src/lib/source.ts)
- [ ] Create loader with `fumadocs-core/source`
- [ ] Export `docsSource` (baseUrl: /docs)
- [ ] Export `legalSource` (baseUrl: /)
- [ ] Add lucide icons plugin

### 4. Docs Route (src/routes/docs/$.tsx)
- [ ] Create catch-all route for /docs/*
- [ ] Use serverFn for page tree + page path
- [ ] Use clientLoader pattern from fumadocs-mdx:collections/browser
- [ ] Use custom layout from www (not fumadocs-ui)

### 5. Docs Module (src/modules/docs/)
- [ ] Port source.tsx from www/modules/docs/
- [ ] Port mdx-components.tsx from www
- [ ] Port TOC components
- [ ] Port DocsPager
- [ ] Port PageTabs (if needed)
- [ ] Port code-block components

### 6. Content Setup
- [ ] Symlink content/docs → ../www/content/docs
- [ ] Symlink content/legal → ../www/content/(root)/(legal)
- [ ] Or copy content if symlinks cause issues

### 7. Legal Route (src/routes/$slug.tsx)
- [ ] Create catch-all for legal pages (/privacy-policy, /terms-of-service)
- [ ] Simpler layout than docs (no sidebar)
