# dotUI Architecture Cleanup Plan

## Goal

Remove `@dotui/style-system` by generating CSS vars directly where needed.

---

## Architecture

```
@dotui/colors
└── createTheme(ColorsConfig) → ColorScales

@dotui/core
├── data/              → Generated registry data
│   ├── variants.ts
│   └── icons.ts
│
├── schemas/           → Validation schemas
│   ├── style.ts       → StyleConfig
│   ├── theme.ts
│   └── ...
│
├── registry/          → Server-side (for /r API, CLI)
│   ├── generators/    → generateThemeJson() ← UPDATE THIS
│   └── transforms/    → transformItemJson(), icons, imports
│
├── react/             → Client-side (React)
│   ├── style-provider.tsx    ← Single provider (no sub-providers)
│   └── dynamic-component.tsx
│
└── types.ts

@dotui/style-system    → DELETE
```

## Core Package Exports

```typescript
// @dotui/core/schemas
export * from "./schemas";

// @dotui/core/registry (server-side)
export * from "./registry";

// @dotui/core/react (client-side)
export { StyleProvider } from "./react/style-provider";

// @dotui/core/data
export * from "./data";
```

---

## Tasks

### Phase 1: Reorganize Core Package

Rename and move files:
- [ ] `__registry__/` → `data/`
- [ ] `shadcn/` → `registry/`
- [ ] `style/` + `components/` → `react/`
  - Merge into single `style-provider.tsx` (delete theme-provider, variants-provider)
  - Keep `dynamic-component.tsx`
- [ ] Update `package.json` exports
- [ ] Update internal imports
- [ ] Update external imports (www, registry package)

### Phase 2: Update `generateThemeJson()`

Location: `packages/core/src/registry/generators/theme.ts`

Currently it expects `Style.theme.cssVars` from style-system.
Update to:
- [ ] Take `StyleConfig` directly (not `Style`)
- [ ] Call `createTheme()` from @dotui/colors to get color scales
- [ ] Convert scales → CSS vars (light/dark)
- [ ] Add radius, spacing, typography vars
- [ ] Return the theme JSON

### Phase 3: Update Registry API Route

Location: `www/app/r/[...params]/route.ts`

- [ ] Remove `@dotui/style-system` imports
- [ ] Remove `createStyle()` call
- [ ] Pass `StyleConfig` directly to `generateThemeJson()`
- [ ] Update type imports to use `@dotui/core`

### Phase 4: Rewrite StyleProvider

Location: `packages/core/src/react/style-provider.tsx`

Single provider that does everything:
- [ ] Generate color scales from `config.theme.colors` using `createTheme()`
- [ ] Convert scales to CSS vars
- [ ] Inject CSS vars into DOM (inline style on wrapper div)
- [ ] Handle `mode` prop (apply light or dark vars)
- [ ] Handle `unstyled` prop (skip CSS vars injection)
- [ ] No sub-providers, no exported hooks (keep minimal)

### Phase 5: Delete style-system

- [ ] Remove `packages/style-system/` directory
- [ ] Remove from `www/package.json`
- [ ] Remove from `.changeset/config.json`
- [ ] Clean up any remaining imports

---

## Key Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `generateThemeJson()` | core/registry/generators | Returns CSS vars JSON for `/r/[style]/theme` |
| `transformItemJson()` | core/registry/transforms | Transforms component code (icons, variants) - NO CHANGES |
| `StyleProvider` | core/react | Single provider: generates + injects CSS vars into DOM |

---

## CSS Vars Generation

Input: `StyleConfig.theme.colors` (ColorsConfig from @dotui/colors)

```typescript
// 1. Get color scales
const scales = createTheme(config.theme.colors);
// → { light: { primary: { 50: "...", 100: "...", ... }, neutral: {...} }, dark: {...} }

// 2. Convert to CSS vars
const lightVars = {
  "--primary-50": scales.light.primary["50"],
  "--primary-100": scales.light.primary["100"],
  // ...
  "--neutral-50": scales.light.neutral["50"],
  // ...
};

// 3. Add other theme vars
lightVars["--radius"] = `${config.theme.radius}rem`;
lightVars["--spacing"] = `${config.theme.spacing}rem`;
lightVars["--font-heading"] = config.theme.typography.headingFont;
lightVars["--font-body"] = config.theme.typography.bodyFont;
```

---

## Notes

- `transformItemJson()` doesn't need changes - it handles component transforms
- Component-specific `cssVars` from meta.ts are passed through as-is
- No `createStyle()` abstraction needed
