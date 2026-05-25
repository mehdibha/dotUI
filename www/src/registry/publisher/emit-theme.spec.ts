import { describe, expect, test } from "vitest";

import type { RegistryItem } from "@/registry/types";

import { emitInitItem } from "./emit-theme";

type InitItemConfig = {
	config?: {
		tailwind?: { cssVariables?: boolean };
		registries?: Record<string, unknown>;
	};
};

const baseRegistryCss = {
	css: {
		'@import "tw-animate-css"': {},
		"@utility focus-ring": {
			"@apply ring-2 ring-border-focus": {},
		},
		":root": {
			"--neutral-50": "hsl(0, 0%, 98%)",
		},
		".dark": {
			"--neutral-50": "hsl(0, 6%, 4%)",
		},
	},
	cssVars: {
		theme: {
			"--color-bg": "var(--neutral-50)",
		},
	},
} as const satisfies Pick<RegistryItem, "css" | "cssVars">;

describe("emitInitItem", () => {
	test("emits base CSS through registry fields instead of a CSS file", () => {
		const item = emitInitItem({
			baseRegistryCss,
			preset: { density: "compact", componentParams: {} },
			registryRoot: "https://dotui.com",
		});

		expect(item.type).toBe("registry:base");
		expect(item.css).toEqual(baseRegistryCss.css);
		expect(item.cssVars).toEqual(baseRegistryCss.cssVars);
		expect((item as InitItemConfig).config?.tailwind?.cssVariables).toBe(true);
		expect((item as InitItemConfig).config?.registries?.["@dotui"]).toBe("https://dotui.com/r/{name}?preset=");
		expect(item.files?.map((file) => file.target)).toEqual(["src/lib/utils.ts"]);
		expect(JSON.stringify(item)).not.toContain("dotui-base.css");
	});

	test("normalizes legacy light and dark cssVars into css rules", () => {
		const item = emitInitItem({
			baseRegistryCss: {
				cssVars: {
					light: { "neutral-50": "hsl(0, 0%, 98%)" },
					dark: { "neutral-50": "hsl(0, 6%, 4%)" },
				},
			},
			preset: { density: "compact", componentParams: {} },
			registryRoot: "https://dotui.com",
		});

		expect(item.css).toMatchObject({
			":root": { "--neutral-50": "hsl(0, 0%, 98%)" },
			".dark": { "--neutral-50": "hsl(0, 6%, 4%)" },
		});
		expect(item.cssVars).toBeUndefined();
	});

	test("writes the preset into the @dotui registry URL string", () => {
		const item = emitInitItem({
			baseRegistryCss,
			preset: { density: "compact", componentParams: {} },
			encodedPreset: "abc123",
			registryRoot: "https://dotui.com",
		});

		expect((item as InitItemConfig).config?.registries?.["@dotui"]).toBe("https://dotui.com/r/{name}?preset=abc123");
	});

	test("adds non-compact density as a root css var without mutating the base fields", () => {
		const item = emitInitItem({
			baseRegistryCss,
			preset: { density: "default", componentParams: {} },
			registryRoot: "https://dotui.com",
		});

		expect(item.css?.[":root"]).toMatchObject({ "--dotui-density": "default" });
		expect(baseRegistryCss.css[":root"]).not.toHaveProperty("--dotui-density");
	});
});
