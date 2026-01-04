import type { Transform } from "./types";

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
	result = result.replace(/from\s+["']lucide-react["']/g, `from "${targetPackage}"`);

	// Replace @/icons imports (alias used in registry)
	result = result.replace(/from\s+["']@\/icons["']/g, `from "${targetPackage}"`);

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
export function createIconTransform(targetLibrary: string, iconMap: Record<string, Record<string, string>>): Transform {
	return (content) => transformIcons(content, { iconLibrary: targetLibrary, iconMap });
}
