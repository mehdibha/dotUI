"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { TV, TVReturnType, VariantProps } from "tailwind-variants";

import type { Density } from "@/modules/create/preset/types";

/* --------------------------------- Types --------------------------------- */

type StyleSelections = Record<string, string>;
type ParamSelections = Record<string, string>;

interface DesignSystemContextValue {
	styles: StyleSelections;
	params: ParamSelections;
	density: Density;
}

/* -------------------------------- Context -------------------------------- */

const DesignSystemContext = React.createContext<DesignSystemContextValue>({
	styles: {},
	params: {},
	density: "default",
});

/* -------------------------------- Provider ------------------------------- */

/** Resolve a param value to a CSS value. "--radius-md" → "var(--radius-md)", "0" → "0" */
function resolveCssValue(value: string): string {
	return value.startsWith("--") ? `var(${value})` : value;
}

interface DesignSystemProviderProps {
	styles: StyleSelections;
	params?: ParamSelections;
	density?: Density;
	children: React.ReactNode;
}

function DesignSystemProvider({
	styles,
	params = {},
	density = "default",
	children,
}: DesignSystemProviderProps) {
	const value = React.useMemo(() => ({ styles, params, density }), [styles, params, density]);

	const cssVars = React.useMemo(() => {
		const vars: Record<string, string> = {};
		for (const [prop, val] of Object.entries(params)) {
			vars[prop] = resolveCssValue(val);
		}
		return vars;
	}, [params]);

	// Apply CSS custom properties to :root.
	// Using a wrapper <div> doesn't work for tokens that reference each other
	// via calc() + var() (e.g. --radius-sm = calc(.25rem * var(--radius-factor)))
	// because the inner var() is substituted at declaration time at :root and
	// the resolved value is inherited. Setting the overrides on :root forces
	// those dependent tokens to recompute with the new values.
	React.useLayoutEffect(() => {
		const root = document.documentElement;
		const applied = Object.keys(cssVars);
		for (const key of applied) {
			root.style.setProperty(key, cssVars[key]!);
		}
		return () => {
			for (const key of applied) {
				root.style.removeProperty(key);
			}
		};
	}, [cssVars]);

	return <DesignSystemContext.Provider value={value}>{children}</DesignSystemContext.Provider>;
}

/* ------------------------------ createStyles ----------------------------- */

/** tv's config object — the argument type of the exported `tv` function. */
type TvConfig = Parameters<TV>[0];

/**
 * Full createStyles config. `density` and `styles` entries are symmetric:
 * both are tv overrides of `base`, composed at module init via tv's `extend`.
 *
 * Composition order per (density, aesthetic) pair:
 *   base  →  density[d]  →  styles[a]
 *
 * Density is *not* a tv variant — it selects which precomputed tv to use at
 * runtime. This keeps the public `VariantProps` clean.
 */
interface CreateStylesConfig<Base extends TvConfig, StyleNames extends string> {
	base: Base;
	density: Record<Density, TvConfig>;
	styles: Record<StyleNames, TvConfig>;
}

/* ----- new-shape detection ----- */

function isNewShape(config: unknown): config is CreateStylesConfig<TvConfig, string> {
	if (!config || typeof config !== "object") return false;
	const c = config as Record<string, unknown>;
	return (
		"base" in c &&
		"density" in c &&
		"styles" in c &&
		typeof c.base === "object" &&
		c.base !== null &&
		typeof c.density === "object" &&
		c.density !== null &&
		typeof c.styles === "object" &&
		c.styles !== null
	);
}

/* ----- public API ----- */

interface CreateStylesMeta {
	name: string;
	defaultStyle: string;
	styles: Record<string, unknown>;
}

// Generic TvFn for the legacy code path / runtime maps.
type TvFn = ReturnType<TV>;

// Helpers for extracting typed pieces of a tv config. We don't re-check the
// shape against tv's type constraints here — tv itself enforces them at the
// call site; we only need the keys.
type ExtractVariants<C> = C extends { variants: infer V } ? V : {};
type ExtractSlots<C> = C extends { slots: infer S } ? S : undefined;
type ExtractBase<C> = C extends { base: infer B } ? B : undefined;

// Merge slot key-sets. We only care about the KEY names downstream (TVReturnType
// maps `keyof S`), so values are collapsed to `any` — intersecting distinct
// string literal values would otherwise collapse the value type to `never`.
type MergeSlots<A, B> = [A] extends [undefined]
	? [B] extends [undefined]
		? undefined
		: { [K in keyof B]: any }
	: [B] extends [undefined]
		? { [K in keyof A]: any }
		: { [K in keyof A | keyof B]: any };

// Extract typed tv return from merged base + default-style-override configs,
// so callers see real slot/variant keys (including variants/slots declared in
// the per-style override, not just in `base`).
type InferTv<Base, Style> = TVReturnType<
	// @ts-expect-error — intersection of variants may not exactly match constraint
	ExtractVariants<Base> & ExtractVariants<Style>,
	MergeSlots<ExtractSlots<Base>, ExtractSlots<Style>>,
	ExtractBase<Style> extends undefined ? ExtractBase<Base> : ExtractBase<Style>,
	{},
	undefined
>;

// Legacy shape: { [styleName]: TvFn }.
function createStyles<M extends CreateStylesMeta, T extends Record<string, TvFn>>(
	meta: M,
	stylesMap: T,
): { useStyles: () => T[keyof T] };
// New shape: { base, density, styles }. Return type flows from merging
// tv(config.base) with the default style override, so consumers see the real
// slot / variant keys.
function createStyles<
	const M extends CreateStylesMeta,
	const Base,
	const Styles extends Record<string, unknown>,
>(
	meta: M,
	config: { base: Base; density: Record<Density, TvConfig>; styles: Styles },
): {
	useStyles: () => InferTv<Base, Styles[M["defaultStyle"] & keyof Styles]>;
	styles: InferTv<Base, Styles[M["defaultStyle"] & keyof Styles]>;
};
function createStyles(meta: CreateStylesMeta, config: any): any {
	if (isNewShape(config)) {
		const { base, density, styles } = config;

		const baseTv = tv(base as never);

		// Precompute (density × aesthetic) — e.g. 3 densities × N presets.
		const composed: Record<string, Record<string, TvFn>> = {};
		for (const d of Object.keys(density) as Density[]) {
			const densityTv = tv({ extend: baseTv as never, ...(density[d] as TvConfig) } as never);
			composed[d] = {};
			for (const [aestheticName, aestheticOverride] of Object.entries(styles)) {
				composed[d]![aestheticName] = tv({
					extend: densityTv as never,
					...(aestheticOverride as TvConfig),
				} as never);
			}
		}

		function pick(density: Density, aesthetic: string): TvFn {
			const byAesthetic = composed[density] ?? composed.default!;
			return byAesthetic[aesthetic] ?? byAesthetic[meta.defaultStyle]!;
		}

		function useStyles() {
			const { styles: selections, density } = React.useContext(DesignSystemContext);
			const aesthetic = selections[meta.name] ?? meta.defaultStyle;
			return pick(density, aesthetic);
		}

		return {
			useStyles,
			// Expose the (default density, default aesthetic) tv for
			// `typeof styles → VariantProps<...>` type derivation.
			styles: pick("default", meta.defaultStyle),
		};
	}

	// Legacy shape: { [styleName]: TvFn }
	const stylesMap = config as Record<string, TvFn>;
	function useStyles() {
		const { styles: selections } = React.useContext(DesignSystemContext);
		const selected = selections[meta.name];
		if (selected && selected in stylesMap) {
			return stylesMap[selected]!;
		}
		return stylesMap[meta.defaultStyle]!;
	}
	return { useStyles };
}

export type { VariantProps };
export { createStyles, DesignSystemContext, DesignSystemProvider };
