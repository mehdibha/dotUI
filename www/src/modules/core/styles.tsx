"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { ClassValue, TV, VariantProps } from "tailwind-variants";

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

/**
 * A tv config (base layer). Accepted keys mirror what `tv()` takes — slots,
 * base, variants, compoundVariants, compoundSlots, defaultVariants.
 */
interface TvConfig {
	slots?: Record<string, ClassValue>;
	base?: ClassValue;
	variants?: Record<string, Record<string, ClassValue | Record<string, ClassValue>>>;
	compoundVariants?: Array<Record<string, unknown>>;
	compoundSlots?: Array<Record<string, unknown>>;
	defaultVariants?: Record<string, unknown>;
}

/**
 * An override layered on top of `base` via tv's `extend`. Structurally a tv
 * config — same keys, same semantics — so density entries and style entries
 * share one shape.
 */
type TvOverride = TvConfig;

/**
 * Full createStyles config. `density` and `styles` entries are symmetric:
 * both are tv overrides of `base`, composed at module init via tv's `extend`.
 *
 * Composition order per (density, aesthetic) pair:
 *   base  →  density[d]  →  styles[a]
 *
 * Density is *not* a tv variant — it selects which precomputed tv to use at
 * runtime. This keeps the public `VariantProps` clean and lets the CLI emit a
 * flat tv call per user-selected (density, style) combo.
 */
interface CreateStylesConfig<StyleNames extends string> {
	base: TvConfig;
	density: Record<Density, TvOverride>;
	styles: Record<StyleNames, TvOverride>;
}

type TvFn = ReturnType<TV>;

/* ----- new-shape detection ----- */

function isNewShape(config: unknown): config is CreateStylesConfig<string> {
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

type CreateStylesReturn<S extends TvFn> = {
	useStyles: () => S;
	styles: S;
};

function createStyles<M extends CreateStylesMeta, T extends Record<string, TvFn>>(
	meta: M,
	stylesMap: T,
): { useStyles: () => T[keyof T] };
function createStyles<M extends CreateStylesMeta, C extends CreateStylesConfig<string>>(
	meta: M,
	config: C,
): CreateStylesReturn<TvFn>;
function createStyles(meta: CreateStylesMeta, config: unknown) {
	if (isNewShape(config)) {
		const { base, density, styles } = config;

		const baseTv = tv(base as never);

		// Precompute (density × aesthetic) — e.g. 3 densities × N presets.
		const composed: Record<string, Record<string, TvFn>> = {};
		for (const d of Object.keys(density) as Density[]) {
			const densityTv = tv({ extend: baseTv as never, ...(density[d] as TvOverride) } as never);
			composed[d] = {};
			for (const [aestheticName, aestheticOverride] of Object.entries(styles)) {
				composed[d]![aestheticName] = tv({
					extend: densityTv as never,
					...(aestheticOverride as TvOverride),
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
