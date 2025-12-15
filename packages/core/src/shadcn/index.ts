/**
 * Shadcn adapter module
 *
 * Transforms registry items for shadcn CLI compatibility
 */

export { generateItem, generateAll, getItemNames } from "./generator";
export type { ShadcnItem, ShadcnFile, GenerateItemOptions } from "./generator";

export { generateTheme } from "./theme";
export type { ShadcnTheme } from "./theme";

export { applyTransforms, transformImports, transformIcons } from "./transform";
export type { TransformContext } from "./transform";
