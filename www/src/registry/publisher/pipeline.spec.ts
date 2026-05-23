import { describe, expect, test } from "vitest";

import { flattenStylesConfig } from "./flatten";
import { resolveScalarClasses } from "./resolve-classes";
import { serializeTvConfig } from "./serialize";

import type { RegistryItem } from "@/registry/types";

const fixtureMeta = {
	name: "button",
	params: {
		radius: {
			kind: "scalar",
			type: "radius",
			cssVar: "--btn-radius",
			default: "--radius-sm",
		},
		style: {
			kind: "enum",
			default: "default",
			values: ["default", "quiet"],
		},
	},
} satisfies Pick<RegistryItem, "name" | "params">;

const fixtureConfig = {
	base: {
		base: "rounded-(--btn-radius) bg-neutral",
		variants: {
			size: { md: "h-8" },
		},
	},
	density: {
		comfortable: {
			variants: {
				size: { md: "px-4" },
			},
		},
	},
	params: {
		style: {
			quiet: {
				base: "text-fg-muted",
			},
		},
	},
};

describe("publisher request-time pipeline", () => {
	test("flattens density and enum params then resolves scalar utility classes", () => {
		const flattened = flattenStylesConfig(fixtureConfig, fixtureMeta, {
			density: "comfortable",
			componentParams: { style: "quiet", radius: "--radius-lg" },
		});

		const resolved = resolveScalarClasses(flattened, fixtureMeta, {
			style: "quiet",
			radius: "--radius-lg",
		});

		expect(resolved).toEqual({
			base: "rounded-lg bg-neutral text-fg-muted",
			variants: {
				size: {
					md: "h-8 px-4",
				},
			},
		});

		const serialized = serializeTvConfig(resolved);
		expect(serialized).toContain('"base": "rounded-lg bg-neutral text-fg-muted"');
	});
});
