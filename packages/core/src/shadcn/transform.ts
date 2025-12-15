/**
 * Content transforms for shadcn output
 */

import { icons as iconMappings } from "../__generated__/icons";
import type { IconLibrary } from "../types";

export interface TransformContext {
	iconLibrary: IconLibrary;
}

/**
 * Transform @dotui/registry/* imports to @/* (user's project alias)
 */
export function transformImports(content: string): string {
	return content.replace(/@dotui\/registry\//g, "@/");
}

/**
 * Transform icon imports to target library
 */
export function transformIcons(content: string, context: TransformContext): string {
	const { iconLibrary } = context;

	// If lucide (default), no transform needed
	if (iconLibrary === "lucide") {
		return content;
	}

	let result = content;

	// Get target library package name
	const targetPackage = iconLibrary === "remix" ? "@remixicon/react" : "lucide-react";

	// Replace lucide-react imports
	result = result.replace(/from\s+["']lucide-react["']/g, `from "${targetPackage}"`);

	// Replace @/icons imports (alias used in registry)
	result = result.replace(/from\s+["']@\/icons["']/g, `from "${targetPackage}"`);

	// Replace icon names based on mapping
	for (const [_iconName, mappings] of Object.entries(iconMappings)) {
		const lucideName = mappings.lucide;
		const targetName = iconLibrary === "remix" ? mappings.remix : mappings.lucide;
		if (targetName && targetName !== lucideName) {
			// Replace the icon name in imports and usages
			const regex = new RegExp(`\\b${lucideName}\\b`, "g");
			result = result.replace(regex, targetName);
		}
	}

	return result;
}

/**
 * Apply all transforms to content
 */
export function applyTransforms(content: string, context: TransformContext): string {
	let result = content;
	result = transformImports(result);
	result = transformIcons(result, context);
	return result;
}
