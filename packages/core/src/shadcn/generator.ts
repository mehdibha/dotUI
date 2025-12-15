/**
 * Shadcn registry item generator
 */

import { ui } from "../__generated__/ui";
import { lib } from "../__generated__/lib";
import { hooks } from "../__generated__/hooks";
import { blocks } from "../__generated__/blocks";
import { base } from "../__generated__/base";
import type { Style, Variants } from "../types";
import { applyTransforms } from "./transform";

interface FileEntry {
	readonly type?: string;
	readonly path: string;
	readonly target: string;
	readonly content: string;
}

interface VariantData {
	readonly files?: readonly FileEntry[];
	readonly registryDependencies?: readonly string[];
	readonly dependencies?: readonly string[];
}

interface RegistryItem {
	readonly name: string;
	readonly type?: string;
	readonly defaultVariant?: string;
	readonly variants?: Record<string, VariantData>;
	readonly files?: readonly FileEntry[];
	readonly registryDependencies?: readonly string[];
	readonly dependencies?: readonly string[];
}

// Combine all registry items
const allItems = [...base, ...lib, ...hooks, ...ui, ...blocks] as readonly RegistryItem[];

export interface GenerateItemOptions {
	style: Style;
	styleName: string;
	baseUrl: string;
}

export interface ShadcnFile {
	type: string;
	path: string;
	target: string;
	content: string;
}

export interface ShadcnItem {
	name: string;
	type: string;
	title?: string;
	description?: string;
	dependencies?: string[];
	devDependencies?: string[];
	registryDependencies?: string[];
	files: ShadcnFile[];
}

/**
 * Find a registry item by name
 */
function findItem(name: string) {
	return allItems.find((item) => item.name === name);
}

/**
 * Get the selected variant for a component based on style config
 */
function getSelectedVariant(itemName: string, variants: Variants): string {
	const variant = variants[itemName as keyof Variants];
	return variant || "basic";
}

/**
 * Generate a shadcn-compatible registry item
 */
export function generateItem(
	itemName: string,
	options: GenerateItemOptions,
): ShadcnItem | null {
	const { style, styleName, baseUrl } = options;

	const item = findItem(itemName);
	if (!item) {
		console.warn(`Registry item not found: ${itemName}`);
		return null;
	}

	// Determine which variant to use
	const selectedVariant = getSelectedVariant(itemName, style.variants);

	// Get files from variant or top-level
	let files: ShadcnFile[] = [];
	let dependencies: string[] = [];
	let registryDependencies: string[] = [];

	if ("variants" in item && item.variants) {
		const variant = item.variants[selectedVariant];
		if (variant) {
			files = (variant.files || []).map((f) => ({
				type: f.type || "registry:ui",
				path: f.path,
				target: f.target,
				content: f.content,
			}));
			dependencies = [...(variant.dependencies || [])];
			registryDependencies = [...(variant.registryDependencies || [])];
		}
	} else if ("files" in item && item.files) {
		files = item.files.map((f) => ({
			type: f.type || "registry:ui",
			path: f.path,
			target: f.target,
			content: f.content,
		}));
	}

	// Get top-level dependencies if not in variant
	if ("dependencies" in item && item.dependencies) {
		dependencies = [...dependencies, ...item.dependencies];
	}
	if ("registryDependencies" in item && item.registryDependencies) {
		registryDependencies = [...registryDependencies, ...item.registryDependencies];
	}

	// Transform file contents
	const transformedFiles = files.map((file) => ({
		...file,
		content: applyTransforms(file.content, {
			iconLibrary: style.icons.library,
		}),
	}));

	// Update registry dependencies with full URLs
	const fullRegistryDependencies = registryDependencies.map(
		(dep) => `${baseUrl}/${styleName}/${dep}`,
	);

	return {
		name: itemName,
		type: item.type || "registry:ui",
		dependencies: dependencies.length > 0 ? [...new Set(dependencies)] : undefined,
		registryDependencies: fullRegistryDependencies.length > 0 ? fullRegistryDependencies : undefined,
		files: transformedFiles,
	};
}

/**
 * Generate all registry items for a style
 */
export function generateAll(options: GenerateItemOptions): ShadcnItem[] {
	const items: ShadcnItem[] = [];

	for (const item of allItems) {
		const generated = generateItem(item.name, options);
		if (generated) {
			items.push(generated);
		}
	}

	return items;
}

/**
 * Get list of all available item names
 */
export function getItemNames(): string[] {
	return allItems.map((item) => item.name);
}
