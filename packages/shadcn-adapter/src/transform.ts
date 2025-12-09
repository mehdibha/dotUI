import { promises as fs } from "node:fs";
import path from "node:path";
import type { RegistryItem } from "shadcn/schema";

import { registryIcons } from "@dotui/registry/icons/registry";
import {
  applyTransforms,
  type TransformContext,
  transformIcons,
  transformImports,
} from "@dotui/transformers";
import type { ColorFormat, Style, Variants } from "@dotui/style-system/types";
import type { FileEntry, ItemJson } from "@dotui/types/registry";

export interface TransformOptions {
  style: Style;
  styleName: string;
  baseUrl: string;
  colorFormat?: ColorFormat;
}

/**
 * Build transform context from style configuration
 */
function buildTransformContext(style: Style): TransformContext {
  const targetIconLibrary =
    style.icons.library === "remix" ? "remix" : "lucide";

  return {
    iconLibrary: targetIconLibrary,
    iconMap: registryIcons as Record<string, Record<string, string>>,
  };
}

/**
 * Apply style-specific transforms to pre-built item JSON
 * This also resolves variants based on the style configuration
 */
export function transformItemJson(
  item: ItemJson,
  options: TransformOptions,
): ItemJson {
  const { style, styleName, baseUrl } = options;

  const context = buildTransformContext(style);

  // Determine which variant to use based on style configuration
  const itemName = item.name;
  const selectedVariant =
    itemName in style.variants
      ? style.variants[itemName as keyof Variants]
      : item.defaultVariant || "basic";

  // Get the files to transform - either from variant or base files
  let filesToTransform = item.files;

  if (item.variants && selectedVariant && item.variants[selectedVariant]) {
    // Use variant-specific files
    filesToTransform = item.variants[selectedVariant].files;
  }

  // Transform all files
  const transformedFiles = filesToTransform.map((file) =>
    transformFile(file, context),
  );

  // Update registry dependencies with full URLs
  const registryDependencies = item.registryDependencies?.map(
    (dep) => `${baseUrl}/${styleName}/${dep}`,
  );

  // Return a flat structure (shadcn expects files, not variants in output)
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies,
    files: transformedFiles,
  };
}

/**
 * Transform a single file's content
 */
function transformFile(file: FileEntry, context: TransformContext): FileEntry {
  if (!file.content) {
    return file;
  }

  const transformedContent = applyTransforms(
    file.content,
    [transformImports, transformIcons],
    context,
  );

  return {
    ...file,
    content: transformedContent,
  };
}

/**
 * Update registry dependencies with full URLs
 */
export function updateRegistryDependencies(
  registryItem: RegistryItem,
  options: {
    styleName: string;
    baseUrl: string;
    style: Style;
  },
): RegistryItem {
  const { styleName, baseUrl } = options;

  return {
    ...registryItem,
    registryDependencies: registryItem.registryDependencies?.map(
      (dep) => `${baseUrl}/${styleName}/${dep}`,
    ),
  };
}

/**
 * Update files in a registry item by loading content and applying transforms
 */
export async function updateFiles(
  registryItem: RegistryItem,
  options: {
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<RegistryItem> {
  if (!registryItem.files) {
    return registryItem;
  }

  const context = buildTransformContext(options.style);

  for (const file of registryItem.files) {
    // Load file content from filesystem if not already present
    if (!file.content && file.path) {
      try {
        const filePath = path.join(options.registryBasePath, file.path);
        const content = await fs.readFile(filePath, "utf-8");
        file.content = content;

        file.path = file.path.replace(options.registryBasePath, "");

        const hasVariant = !!registryItem.name.split(":")[1];
        if (hasVariant) {
          const pathRegex = /^components\/([^/]+)\/([^/]+)\.tsx?$/;
          const pathMatch = pathRegex.exec(file.path);
          if (pathMatch) {
            file.path = `components/${pathMatch[1]}.${file.path.split(".").pop()}`;
          }
        }
      } catch (error) {
        console.error(`Failed to read file ${file.path}:`, error);
        continue;
      }
    }

    if (!file.content) {
      continue;
    }

    // Apply transforms
    const transformedContent = applyTransforms(
      file.content,
      [transformImports, transformIcons],
      context,
    );

    file.content = transformedContent;
  }

  return registryItem;
}

/**
 * Generate theme JSON with style-specific CSS variables
 */
export function generateThemeJson(
  style: Style,
  styleName: string,
  _colorFormat: ColorFormat,
): unknown {
  return {
    name: styleName,
    type: "registry:style",
    tailwind: {
      config: {
        theme: {
          extend: {},
        },
      },
    },
    cssVars: {
      light: style.theme.cssVars?.light || {},
      dark: style.theme.cssVars?.dark || {},
    },
  };
}
