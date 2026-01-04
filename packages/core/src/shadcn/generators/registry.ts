import type { Registry } from "shadcn/schema";

import { ui as registryUi } from "@dotui/core/__registry__/ui";
import { updateRegistryDependencies } from "@dotui/core/shadcn/transform";
import type { StyleConfig } from "@dotui/core/schemas/style";
import type { VariantsConfig } from "@dotui/core/schemas/variants";

import { generateRegistryAll } from "./all";
import { generateRegistryBase } from "./base";
import { generateRegistryTheme } from "./theme";

export function generateRegistry(options: { styleName: string; baseUrl: string; config: StyleConfig }): Registry {
	const components = registryUi
		.filter((item) => {
			const [name, variant] = item.name.split(":") as [string, string];
			return options.config.variants[name as keyof VariantsConfig] === variant;
		})
		.map((item) => {
			const [name] = item.name.split(":") as [string, string];
			return updateRegistryDependencies({ ...item, name }, options);
		});

	return {
		name: "dotui",
		homepage: "https://dotui.org",
		items: [generateRegistryBase(options), generateRegistryTheme(options), ...components, generateRegistryAll(options)],
	};
}
