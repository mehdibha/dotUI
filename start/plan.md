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
