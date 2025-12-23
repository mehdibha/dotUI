/**
 * API Reference loader
 * Loads pre-generated JSON files at build time
 */

import fs from "node:fs/promises";
import path from "node:path";

import type { ComponentApiReference } from "./types";

const GENERATED_DIR = path.join(process.cwd(), "src/modules/references/generated");

/**
 * Load API reference data for a component
 * @param name - Component name in kebab-case (e.g., "button", "date-picker")
 */
export async function loadApiReference(name: string): Promise<ComponentApiReference | null> {
	try {
		const filePath = path.join(GENERATED_DIR, `${name}.json`);
		const content = await fs.readFile(filePath, "utf-8");
		return JSON.parse(content) as ComponentApiReference;
	} catch (error) {
		console.error(`[references] Failed to load API reference for "${name}":`, error);
		return null;
	}
}

/**
 * Check if an API reference exists for a component
 */
export async function hasApiReference(name: string): Promise<boolean> {
	try {
		const filePath = path.join(GENERATED_DIR, `${name}.json`);
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * List all available API references
 */
export async function listApiReferences(): Promise<string[]> {
	try {
		const files = await fs.readdir(GENERATED_DIR);
		return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""));
	} catch {
		return [];
	}
}
