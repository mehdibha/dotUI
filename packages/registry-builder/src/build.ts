import { promises as fs } from "node:fs";
import path from "node:path";

import { registry } from "@dotui/registry";
import type { BuildOptions } from "@dotui/types/registry";

import { generateItemJson } from "./generators/item";
import {
  generateCategoryManifest,
  generateManifest,
  getCategoryFromType,
} from "./generators/manifest";

const CATEGORIES = ["ui", "hooks", "lib", "base", "blocks"] as const;

/**
 * Build static JSON files from registry
 */
export async function buildRegistry(options: BuildOptions): Promise<void> {
  const { srcDir, outDir, pretty = true } = options;

  console.log("Building registry...");
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

  // Generate item JSON files
  let generatedCount = 0;
  for (const item of registry) {
    try {
      const itemJson = await generateItemJson(item, srcDir);
      const category = getCategoryFromType(item.type);
      const baseName = item.name.split(":")[0]; // Remove variant suffix
      const outputPath = path.join(outDir, category, `${baseName}.json`);

      // Check if file already exists (avoid duplicates from variants)
      try {
        await fs.access(outputPath);
        // File exists, merge variants if needed
        const existing = JSON.parse(await fs.readFile(outputPath, "utf-8"));
        if (itemJson.variants) {
          existing.variants = {
            ...existing.variants,
            ...itemJson.variants,
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
          JSON.stringify(itemJson, null, pretty ? 2 : 0),
        );
        generatedCount++;
      }
    } catch (error) {
      console.error(`Failed to generate ${item.name}:`, error);
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

  console.log(`Generated ${generatedCount} item files`);
  console.log(`Generated ${itemsByCategory.size} category manifests`);
  console.log(`Generated main manifest`);
}
