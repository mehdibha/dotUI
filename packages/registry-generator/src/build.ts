#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

import { registry } from "@dotui/registry";

import { generateComponentJson } from "./generators/component";
import {
  generateCategoryManifest,
  generateManifest,
} from "./generators/manifest";

export interface BuildOptions {
  /** Path to registry source (e.g., packages/registry/src) */
  srcDir: string;
  /** Output directory for JSON files (e.g., packages/registry/dist) */
  outDir: string;
  /** Whether to format JSON output */
  pretty?: boolean;
}

const CATEGORIES = ["ui", "hooks", "lib", "base", "blocks"] as const;

/**
 * Build static JSON files from registry
 */
export async function buildRegistry(options: BuildOptions): Promise<void> {
  const { srcDir, outDir, pretty = true } = options;

  console.log("🔨 Building registry...");
  console.log(`   Source: ${srcDir}`);
  console.log(`   Output: ${outDir}`);

  // Ensure output directory exists
  await fs.mkdir(outDir, { recursive: true });

  // Create category directories
  for (const category of CATEGORIES) {
    await fs.mkdir(path.join(outDir, category), { recursive: true });
  }

  // Group items by category
  const itemsByCategory = new Map<string, typeof registry>();
  for (const item of registry) {
    const category = getCategoryFromType(item.type);
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push(item);
  }

  // Generate component JSON files
  let generatedCount = 0;
  for (const item of registry) {
    try {
      const componentJson = await generateComponentJson(item, srcDir);
      const category = getCategoryFromType(item.type);
      const baseName = item.name.split(":")[0]; // Remove variant suffix
      const outputPath = path.join(outDir, category, `${baseName}.json`);

      // Check if file already exists (avoid duplicates from variants)
      try {
        await fs.access(outputPath);
        // File exists, merge variants if needed
        const existing = JSON.parse(await fs.readFile(outputPath, "utf-8"));
        if (componentJson.variants) {
          existing.variants = {
            ...existing.variants,
            ...componentJson.variants,
          };
        }
        await fs.writeFile(
          outputPath,
          JSON.stringify(existing, null, pretty ? 2 : 0),
        );
      } catch {
        // File doesn't exist, write new
        await fs.writeFile(
          outputPath,
          JSON.stringify(componentJson, null, pretty ? 2 : 0),
        );
        generatedCount++;
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${item.name}:`, error);
    }
  }

  // Generate category manifests
  for (const [category, items] of itemsByCategory) {
    const categoryManifest = generateCategoryManifest(items, category);
    const manifestPath = path.join(outDir, category, "index.json");
    await fs.writeFile(
      manifestPath,
      JSON.stringify(categoryManifest, null, pretty ? 2 : 0),
    );
  }

  // Generate main manifest
  const manifest = generateManifest(registry);
  await fs.writeFile(
    path.join(outDir, "index.json"),
    JSON.stringify(manifest, null, pretty ? 2 : 0),
  );

  console.log(`✅ Generated ${generatedCount} component files`);
  console.log(`✅ Generated ${itemsByCategory.size} category manifests`);
  console.log(`✅ Generated main manifest`);
}

function getCategoryFromType(type: string): string {
  const typeMap: Record<string, string> = {
    "registry:ui": "ui",
    "registry:component": "ui",
    "registry:hook": "hooks",
    "registry:lib": "lib",
    "registry:block": "blocks",
    "registry:style": "base",
    "registry:theme": "themes",
  };

  return typeMap[type] || "other";
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let srcDir = path.resolve(process.cwd(), "../registry/src");
  let outDir = path.resolve(process.cwd(), "dist");
  let pretty = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    if (arg === "--src" && nextArg) {
      srcDir = path.resolve(nextArg);
      i++;
    } else if (arg === "--out" && nextArg) {
      outDir = path.resolve(nextArg);
      i++;
    } else if (arg === "--no-pretty") {
      pretty = false;
    }
  }

  await buildRegistry({ srcDir, outDir, pretty });
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
