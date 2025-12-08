import { promises as fs } from "node:fs";
import path from "node:path";

import { transformImports } from "@dotui/transformers";

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
  variants?: Record<
    string,
    Partial<Omit<RegistryItem, "name" | "type" | "variants">>
  >;
  defaultVariant?: string;
}

/**
 * Generate a component JSON file from a registry item
 */
export async function generateComponentJson(
  item: RegistryItem,
  srcDir: string,
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

/**
 * Read file contents from disk and transform imports
 */
async function readFiles(
  files: Array<{ path: string; type?: string; target?: string }>,
  srcDir: string,
): Promise<FileEntry[]> {
  const result: FileEntry[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(srcDir, file.path);
      const content = await fs.readFile(filePath, "utf-8");

      // Transform imports from @dotui/registry/* to @/*
      const transformedContent = transformImports(content, {});

      result.push({
        path: file.path,
        content: transformedContent,
        type: file.type,
        target: file.target,
      });
    } catch (error) {
      console.error(`Failed to read file ${file.path}:`, error);
    }
  }

  return result;
}
