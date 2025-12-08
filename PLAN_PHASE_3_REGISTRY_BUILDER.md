# Phase 3: Create @dotui/registry-builder Package

## Overview

Create a build-time package that reads registry source files and generates static JSON files. This eliminates runtime filesystem access and enables fast, edge-compatible API responses.

**Key Principle:** All heavy processing (reading files, parsing) happens at build time. Runtime only reads pre-built JSON.

---

## Package Structure

```
packages/registry-builder/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Public exports
    ├── build.ts              # Main build script
    ├── types.ts              # Builder types
    └── generators/
        ├── index.ts
        ├── component.ts      # Generate component JSON
        ├── manifest.ts       # Generate index.json manifest
        └── category.ts       # Generate per-category files
```

---

## 3.1 Create Package Structure

Create `packages/registry-builder/package.json`:
```json
{
  "name": "@dotui/registry-builder",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "license": "MIT",
  "exports": {
    ".": "./src/index.ts"
  },
  "bin": {
    "build-registry": "./bin/build.js"
  },
  "scripts": {
    "build": "tsx src/build.ts"
  },
  "dependencies": {
    "@dotui/registry": "workspace:*",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "@dotui/ts-config": "workspace:*",
    "@types/fs-extra": "^11.0.4",
    "tsx": "^4.19.2",
    "typescript": "^5.8.3"
  }
}
```

---

## 3.2 Define Builder Types

Create `packages/registry-builder/src/types.ts`:
```typescript
export interface BuildOptions {
  /** Path to registry source (e.g., packages/registry/src) */
  srcDir: string;
  /** Output directory for JSON files (e.g., packages/registry/dist) */
  outDir: string;
  /** Whether to format JSON output */
  pretty?: boolean;
}

export interface ComponentJson {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: FileEntry[];
  /** Variant-specific file overrides */
  variants?: Record<string, { files: FileEntry[] }>;
  defaultVariant?: string;
}

export interface FileEntry {
  path: string;
  content: string;
  type?: string;
  target?: string;
}

export interface Manifest {
  version: string;
  generatedAt: string;
  items: ManifestItem[];
}

export interface ManifestItem {
  name: string;
  type: string;
  category: string;
  path: string;
  variants?: string[];
}
```

---

## 3.3 Create Component Generator

Create `packages/registry-builder/src/generators/component.ts`:
```typescript
import fs from "fs-extra";
import path from "path";
import type { ComponentJson, FileEntry } from "../types";

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: Array<{ path: string; type?: string; target?: string }>;
  variants?: Record<string, Omit<RegistryItem, "name" | "type" | "variants">>;
  defaultVariant?: string;
}

export async function generateComponentJson(
  item: RegistryItem,
  srcDir: string
): Promise<ComponentJson> {
  const baseFiles = await readFiles(item.files || [], srcDir);
  
  const json: ComponentJson = {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies: item.registryDependencies,
    files: baseFiles,
  };

  // Process variants if present
  if (item.variants) {
    json.variants = {};
    json.defaultVariant = item.defaultVariant || "basic";

    for (const [variantName, variantData] of Object.entries(item.variants)) {
      const variantFiles = await readFiles(variantData.files || [], srcDir);
      json.variants[variantName] = {
        files: variantFiles,
      };
    }
  }

  return json;
}

async function readFiles(