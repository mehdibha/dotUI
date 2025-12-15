/**
 * @dotui/core
 *
 * Core utilities for dotUI component library
 */

// Types
export type {
	IconLibrary,
	IconsConfig,
	ColorScaleConfig,
	ModeConfig,
	ScaleId,
	ColorsConfig,
	Radius,
	Spacing,
	FontsConfig,
	ThemeConfig,
	ThemeOutput,
	Variants,
	StyleConfig,
	Style,
} from "./types";

// Style module
export { createStyle, generateTheme, themeToCss } from "./style";

// Shadcn module
export {
	generateItem,
	generateAll,
	getItemNames,
	generateTheme as generateShadcnTheme,
	applyTransforms,
} from "./shadcn";

export type {
	ShadcnItem,
	ShadcnFile,
	ShadcnTheme,
	GenerateItemOptions,
} from "./shadcn";
