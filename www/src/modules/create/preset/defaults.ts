import { registryUi } from "@/registry/ui/registry";

import type { DesignSystem } from "./types";

function deriveDefaults(): DesignSystem {
	const componentStyles: Record<string, string> = {};
	const componentParams: Record<string, string> = {};

	for (const item of registryUi) {
		if (item.styles && item.defaultStyle) {
			componentStyles[item.name] = item.defaultStyle;
		}
		if (item.params) {
			for (const [paramName, paramDef] of Object.entries(item.params)) {
				componentParams[paramName] = paramDef.default;
			}
		}
	}

	return { componentStyles, componentParams, density: "compact" };
}

export const DEFAULTS: DesignSystem = deriveDefaults();
