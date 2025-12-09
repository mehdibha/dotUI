import { registryIcons } from "@dotui/registry/icons/registry";
import {
  applyTransforms,
  type TransformContext,
  transformIcons,
  transformImports,
} from "@dotui/transformers";
import type { ComponentJson, FileEntry } from "@dotui/registry-generator";
import type { ColorFormat, Style, Variants } from "@dotui/style-system/types";

export interface TransformOptions {
  style: Style;
  styleName: string;
  baseUrl: string;
  colorFormat?: ColorFormat;
}

/**
 * Apply style-specific transforms to pre-built component JSON
 * This also resolves variants based on the style configuration
 */
export function transformComponentJson(
  component: ComponentJson,
  options: TransformOptions,
): ComponentJson {
  const { style, styleName, baseUrl } = options;

  // Build transform context from style
  const targetIconLibrary =
    style.icons.library === "remix" ? "remix" : "lucide";

  const context: TransformContext = {
    iconLibrary: targetIconLibrary,
    iconMap: registryIcons as Record<string, Record<string, string>>,
  };

  // Determine which variant to use based on style configuration
  const componentName = component.name;
  const selectedVariant =
    componentName in style.variants
      ? style.variants[componentName as keyof Variants]
      : component.defaultVariant || "basic";

  // Get the files to transform - either from variant or base files
  let filesToTransform = component.files;

  if (
    component.variants &&
    selectedVariant &&
    component.variants[selectedVariant]
  ) {
    // Use variant-specific files
    filesToTransform = component.variants[selectedVariant].files;
  }

  // Transform all files
  const transformedFiles = filesToTransform.map((file) =>
    transformFile(file, context),
  );

  // Update registry dependencies with full URLs
  const registryDependencies = component.registryDependencies?.map(
    (dep) => `${baseUrl}/${styleName}/${dep}`,
  );

  // Return a flat structure (shadcn expects files, not variants in output)
  return {
    name: component.name,
    type: component.type,
    title: component.title,
    description: component.description,
    dependencies: component.dependencies,
    devDependencies: component.devDependencies,
    registryDependencies,
    files: transformedFiles,
  };
}

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
