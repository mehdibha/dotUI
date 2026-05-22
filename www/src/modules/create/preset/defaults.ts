import { registryUi } from "@/registry/ui/registry";

import type { DesignSystem } from "./types";

function deriveDefaults(): DesignSystem {
	const componentParams: Record<string, Record<string, string>> = {};

	for (const item of registryUi) {
		if (!item.params) continue;
		const entries: Record<string, string> = {};
		for (const [paramName, def] of Object.entries(item.params)) {
			entries[paramName] = def.default;
		}
		if (Object.keys(entries).length > 0) componentParams[item.name] = entries;
	}

	return { componentParams, tokens: {}, density: "compact" };
}

export const DEFAULTS: DesignSystem = deriveDefaults();
