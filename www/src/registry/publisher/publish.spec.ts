/**
 * End-to-end test of the request-time publish pipeline against hand-written
 * fixtures. Validates each stage individually, then the assembled output.
 *
 * Coverage:
 *   - button   : no slots, no params, multiple variants × densities
 *   - alert    : slots, enum param ("style") that merges variants per-slot,
 *                scalar param ("radius") whose var ref must be rewritten
 */

import { describe, expect, test } from "vitest";

import { flatten } from "./flatten";
import { publish, TV_CONFIG_PLACEHOLDER } from "./publish";
import { buildScalarVarMap, resolveClasses, rewriteClassString } from "./resolve-classes";
import { serializeTvConfig } from "./serialize";

import type { ClassValue, TvLayer } from "./types";

import { alertPublishable } from "./__fixtures__/alert-publishable";
import { buttonPublishable } from "./__fixtures__/button-publishable";

/* ============================================================ */
/* flatten                                                       */
/* ============================================================ */

describe("flatten", () => {
	test("button: base + density 'compact' merges per-variant classes", () => {
		const layer = flatten({
			stylesConfig: buttonPublishable.stylesConfig,
			meta: buttonPublishable.meta,
			density: "compact",
			paramSelections: {},
		});

		// `base` concatenates the base array with the density's `base` string.
		const base = layer.base;
		expect(Array.isArray(base)).toBe(true);
		expect((base as string[]).at(-1)).toBe("gap-1 text-xs/relaxed");

		// `variants.size.xs` came from density only (base had empty string).
		const sizeXs = layer.variants?.size?.xs as ClassValue;
		expect(typeof sizeXs).toBe("string");
		expect(sizeXs).toContain("h-5");

		// `variants.variant.primary` is unchanged (density has no `variant`).
		const primary = layer.variants?.variant?.primary as string;
		expect(primary).toContain("bg-primary");

		// `defaultVariants` flows through.
		expect(layer.defaultVariants).toEqual({ variant: "default", size: "md" });
	});

	test("button: density 'default' uses the default-density classes", () => {
		const layer = flatten({
			stylesConfig: buttonPublishable.stylesConfig,
			meta: buttonPublishable.meta,
			density: "default",
			paramSelections: {},
		});
		const sizeMd = layer.variants?.size?.md as string;
		expect(sizeMd).toContain("h-8");
	});

	test("alert: enum param 'style' merges slot maps inside variants", () => {
		const layer = flatten({
			stylesConfig: alertPublishable.stylesConfig,
			meta: alertPublishable.meta,
			density: "default",
			paramSelections: { style: "sousse" },
		});

		// Slot `root` on base came from base, then the sousse override added
		// "border bg-card text-sm".
		const rootSlot = layer.slots?.root as ClassValue;
		const rootArr = Array.isArray(rootSlot) ? rootSlot : [rootSlot];
		expect(rootArr.some((v) => typeof v === "string" && v.includes("border bg-card text-sm"))).toBe(true);

		// variants.variant.danger.root should contain sousse-specific classes.
		const dangerSlots = layer.variants?.variant?.danger as Record<string, ClassValue>;
		expect(dangerSlots.root).toMatch(/border-border-danger/);
	});

	test("alert: default 'style' selection still merges variant slot classes", () => {
		const layer = flatten({
			stylesConfig: alertPublishable.stylesConfig,
			meta: alertPublishable.meta,
			density: "default",
			paramSelections: {},
		});
		const dangerSlots = layer.variants?.variant?.danger as Record<string, ClassValue>;
		expect(dangerSlots.root).toMatch(/text-fg-danger/);
	});

	test("alert: undefined density layer leaves base untouched", () => {
		// density compact entry is an empty object — should be a no-op.
		const compact = flatten({
			stylesConfig: alertPublishable.stylesConfig,
			meta: alertPublishable.meta,
			density: "compact",
			paramSelections: {},
		});
		const def = flatten({
			stylesConfig: alertPublishable.stylesConfig,
			meta: alertPublishable.meta,
			density: "default",
			paramSelections: {},
		});
		// Both should produce equal `slots.root` content since neither density adds anything.
		expect(compact.slots?.root).toEqual(def.slots?.root);
	});
});

/* ============================================================ */
/* resolve-classes                                               */
/* ============================================================ */

describe("resolve-classes", () => {
	test("rewriteClassString swaps a single var ref to its suffix", () => {
		const map = new Map([["--alert-radius", "md"]]);
		expect(rewriteClassString("rounded-(--alert-radius) bg-card", map)).toBe("rounded-md bg-card");
	});

	test("rewriteClassString leaves unknown vars alone", () => {
		const map = new Map([["--alert-radius", "md"]]);
		expect(rewriteClassString("rounded-(--btn-radius) p-2", map)).toBe("rounded-(--btn-radius) p-2");
	});

	test("buildScalarVarMap uses preset selection over default", () => {
		const map = buildScalarVarMap(alertPublishable.meta, { radius: "--radius-sm" });
		expect(map.get("--alert-radius")).toBe("sm");
	});

	test("buildScalarVarMap falls back to def.default", () => {
		const map = buildScalarVarMap(alertPublishable.meta, {});
		expect(map.get("--alert-radius")).toBe("lg");
	});

	test("resolveClasses rewrites within slot arrays", () => {
		const map = new Map([["--alert-radius", "lg"]]);
		const layer: TvLayer = {
			slots: { root: ["px-4", "rounded-(--alert-radius)"] },
		};
		const out = resolveClasses(layer, map);
		expect(out.slots?.root).toEqual(["px-4", "rounded-lg"]);
	});
});

/* ============================================================ */
/* serialize                                                     */
/* ============================================================ */

describe("serialize", () => {
	test("emits unquoted identifier keys", () => {
		const out = serializeTvConfig({ variant: { primary: "bg-primary" } });
		expect(out).toContain("variant: {");
		expect(out).toContain("primary: ");
	});

	test("quotes non-identifier keys", () => {
		const out = serializeTvConfig({ "data-foo": "x" });
		expect(out).toContain('"data-foo":');
	});

	test("serializes arrays and skips undefined entries", () => {
		const out = serializeTvConfig({ base: ["a", "b"], extra: undefined });
		expect(out).toContain('"a",');
		expect(out).toContain('"b",');
		expect(out).not.toContain("extra");
	});
});

/* ============================================================ */
/* publish (end-to-end)                                          */
/* ============================================================ */

describe("publish", () => {
	test("button: substitutes resolved config into template", () => {
		const { item, rawContent } = publish({
			publishable: buttonPublishable,
			preset: { density: "default", componentParams: {} },
		});

		// Placeholder is gone, replaced with an object literal that includes tv keys.
		expect(rawContent).not.toContain(TV_CONFIG_PLACEHOLDER);
		expect(rawContent).toContain("tv({");
		expect(rawContent).toContain("variants: {");
		expect(rawContent).toContain("defaultVariants: {");

		// Shadcn item is shaped correctly.
		expect(item.name).toBe("button");
		expect(item.type).toBe("registry:ui");
		// `focus-styles` is bundled into the registry:base init item so it gets
		// dropped from per-component registryDependencies. `loader` stays —
		// without a `setKnownDotuiNames` call there's no namespace prefix.
		expect(item.registryDependencies).toEqual(["loader"]);
		const file = item.files?.[0];
		expect(file?.target).toBe("ui/button.tsx");
		expect(file?.content).toBe(rawContent);
	});

	test("alert: rewrites scalar-param var when preset selects 'md' radius", () => {
		const { rawContent } = publish({
			publishable: alertPublishable,
			preset: {
				density: "default",
				componentParams: { alert: { radius: "--radius-md" } },
			},
		});
		expect(rawContent).toContain("rounded-md");
		expect(rawContent).not.toContain("rounded-(--alert-radius)");
	});

	test("alert: falls back to default radius when preset omits the param", () => {
		const { rawContent } = publish({
			publishable: alertPublishable,
			preset: { density: "default", componentParams: {} },
		});
		// alert.radius default is "--radius-lg" → suffix "lg".
		expect(rawContent).toContain("rounded-lg");
	});

	test("alert: published item drops dotui-only fields (params, group)", () => {
		const { item } = publish({
			publishable: alertPublishable,
			preset: { density: "default", componentParams: {} },
		});
		// `params` and `group` are dev-time concerns only.
		expect((item as Record<string, unknown>).params).toBeUndefined();
		expect((item as Record<string, unknown>).group).toBeUndefined();
	});
});
