declare module "globals-docs" {
	/**
	 * Get documentation URL for a global type
	 * @param name - The type name to look up (e.g., "Element", "Event", "Array")
	 * @returns The MDN documentation URL if found, undefined otherwise
	 */
	export function getDoc(name: string): string | undefined;
}
