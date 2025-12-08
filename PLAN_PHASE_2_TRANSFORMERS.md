# Phase 2: Create @dotui/transformers Package

## Overview

Create a standalone package for code transformation utilities. These are simple string-based transforms that convert registry source code for end-user consumption (e.g., rewriting imports, swapping icon libraries).

**Key Principle:** No ts-morph at runtime. All transforms are lightweight string/regex operations.

---

## Package Structure

```
packages/transformers/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Public exports
    ├── types.ts              # Transform types
    ├── pipeline.ts           # Transform pipeline runner
    └── transforms/
        ├── index.ts
        ├── imports.ts        # @dotui/registry/ → @/
        └── icons.ts          # Icon library swapping
```

---

## 2.1 Create Package Structure

Create `packages/transformers/package.json`:

```json
{
  "name": "@dotui/transformers",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "license": "MIT",
  "exports": {
    ".": "./src/index.ts",
    "./transforms": "./src/transforms/index.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "@dotui/ts-config": "workspace:*",
    "typescript": "^5.8.3"
  }
}
```

**Note:** Zero runtime dependencies - pure string operations.

---

## 2.2 Define Types

Create `packages/transformers/src/types.ts`:

```typescript
export interface TransformContext {
  /** Target icon library (e.g., "lucide", "remix") */
  iconLibrary?: string;
  /** Icon mapping from lucide names to target library */
  iconMap?: Record<string, Record<string, string>>;
  /** Any additional context needed by transforms */
  [key: string]: unknown;
}

export type Transform = (content: string, context: TransformContext) => string;

export interface TransformResult {
  content: string;
  /** Transforms that were applied */
  applied: string[];
}
```

---

## 2.3 Create Transform Pipeline

Create `packages/transformers/src/pipeline.ts`:

```typescript
import type { Transform, TransformContext, TransformResult } from "./types";

/**
 * Apply a series of transforms to content
 */
export function applyTransforms(
  content: string,
  transforms: Transform[],
  context: TransformContext = {}
): string {
  return transforms.reduce((c, transform) => transform(c, context), content);
}

/**
 * Apply transforms with tracking of which were applied
 */
export function applyTransformsWithTracking(
  content: string,
  transforms: Array<{ name: string; transform: Transform }>,
  context: TransformContext = {}
): TransformResult {
  const applied: string[] = [];
  let result = content;

  for (const { name, transform } of transforms) {
    const transformed = transform(result, context);
    if (transformed !== result) {
      applied.push(name);
      result = transformed;
    }
  }

  return { content: result, applied };
}
```

---

## 2.4 Create Import Transform

Create `packages/transformers/src/transforms/imports.ts`:

```typescript
import type { Transform } from "../types";

/**
 * Transform @dotui/registry/* imports to @/* (user's project alias)
 */
export const transformImports: Transform = (content) => {
  return content.replace(/@dotui\/registry\//g, "@/");
};

/**
 * Transform imports with custom target alias
 */
export function createImportTransform(targetAlias: string): Transform {
  return (content) => {
    return content.replace(/@dotui\/registry\//g, targetAlias);
  };
}
```

---

## 2.5 Create Icon Transform

Create `packages/transformers/src/transforms/icons.ts`:

```typescript
import type { Transform } from "../types";

/**
 * Transform icon imports to target library
 *
 * Handles:
 * - import { IconName } from "lucide-react" → import { TargetIcon } from "target-lib"
 * - import { IconName } from "@/icons" → import { TargetIcon } from "target-lib"
 */
export const transformIcons: Transform = (content, context) => {
  const { iconLibrary, iconMap } = context;

  // If no icon library specified or it's lucide (default), no transform needed
  if (!iconLibrary || iconLibrary === "lucide" || !iconMap) {
    return content;
  }

  let result = content;

  // Get target library package name
  const targetPackage = getIconLibraryPackage(iconLibrary);

  // Replace lucide-react imports
  result = result.replace(
    /from\s+["']lucide-react["']/g,
    `from "${targetPackage}"`
  );

  // Replace @/icons imports (alias used in registry)
  result = result.replace(
    /from\s+["']@\/icons["']/g,
    `from "${targetPackage}"`
  );

  // Replace icon names based on mapping
  for (const [lucideName, mappings] of Object.entries(iconMap)) {
    const targetName = mappings[iconLibrary];
    if (targetName && targetName !== lucideName) {
      // Replace the icon name in imports and usages
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${lucideName}\\b`, "g");
      result = result.replace(regex, targetName);
    }
  }

  return result;
};

function getIconLibraryPackage(library: string): string {
  const packages: Record<string, string> = {
    lucide: "lucide-react",
    remix: "@remixicon/react",
  };
  return packages[library] || "lucide-react";
}

/**
 * Create a custom icon transform with specific mappings
 */
export function createIconTransform(
  targetLibrary: string,
  iconMap: Record<string, Record<string, string>>
): Transform {
  return (content) =>
    transformIcons(content, { iconLibrary: targetLibrary, iconMap });
}
```

---

## 2.6 Create Index Exports

Create `packages/transformers/src/transforms/index.ts`:

```typescript
export { transformImports, createImportTransform } from "./imports";
export { transformIcons, createIconTransform } from "./icons";
```

Create `packages/transformers/src/index.ts`:

```typescript
// Types
export type { Transform, TransformContext, TransformResult } from "./types";

// Pipeline
export { applyTransforms, applyTransformsWithTracking } from "./pipeline";

// Transforms
export {
  transformImports,
  createImportTransform,
  transformIcons,
  createIconTransform,
} from "./transforms";
```

---

## 2.7 Update Workspace

Add to `pnpm-workspace.yaml` if not using glob pattern.

---

## 2.8 Delete Old Transformers from Registry

After Phase 2 is complete and imports are updated:

Delete from `packages/registry/`:

- `src/_style-system/shadcn-registry/transformers/` (entire folder)

Update `packages/registry/src/shadcn-registry/helpers/update-files.ts` to import from `@dotui/transformers`.

---

## Files to Create

1. `packages/transformers/package.json`
2. `packages/transformers/tsconfig.json`
3. `packages/transformers/src/index.ts`
4. `packages/transformers/src/types.ts`
5. `packages/transformers/src/pipeline.ts`
6. `packages/transformers/src/transforms/index.ts`
7. `packages/transformers/src/transforms/imports.ts`
8. `packages/transformers/src/transforms/icons.ts`

## Files to Delete (after migration)

1. `packages/registry/src/_style-system/shadcn-registry/transformers/index.ts`
2. `packages/registry/src/_style-system/shadcn-registry/transformers/transform-imports.ts`
3. `packages/registry/src/_style-system/shadcn-registry/transformers/transform-icons.ts`

## Files to Update

1. `packages/registry/src/shadcn-registry/helpers/update-files.ts` - Import from @dotui/transformers
2. `packages/registry/package.json` - Add @dotui/transformers dependency

---

## Dependencies

- **Depends on:** Nothing (standalone package)
- **Depended by:** @dotui/registry, @dotui/registry-builder, www app
