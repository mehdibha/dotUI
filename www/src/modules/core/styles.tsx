"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { TV, TVReturnType, VariantProps } from "tailwind-variants";

import type { Density } from "@/modules/create/preset/types";

/* --------------------------------- Types --------------------------------- */

type StyleSelections = Record<string, string>;
type TokenSelections = Record<string, string>;
type ParamSelections = Record<string, Record<string, string>>;

interface DesignSystemContextValue {
	styles: StyleSelections;
	tokens: TokenSelections;
	params: ParamSelections;
	density: Density;
}

/* -------------------------------- Context -------------------------------- */

const DesignSystemContext = React.createContext<DesignSystemContextValue>({
	styles: {},
	tokens: {},
	params: {},
	density: "default",
});

/* -------------------------------- Provider ------------------------------- */

/** Resolve a token value to a CSS value. "--radius-md" → "var(--radius-md)", "0" → "0" */
function resolveCssValue(value: string): string {
	return value.startsWith("--") ? `var(${value})` : value;
}

/**
 * Module-scoped registry of CSS-var declarations carried by component params.
 * Populated by `createStyles` at module load so the provider can look up
 * `vars` for any (component, paramName, paramValue) selection without each
 * component having to forward its config. Mirrors the install-time export:
 * the same vars get baked into globals.css when the CLI installs the component.
 */
const paramVarsRegistry = new Map<string, Record<string, Record<string, Record<string, string>>>>();

interface DesignSystemProviderProps {
	styles: StyleSelections;
	tokens?: TokenSelections;
	params?: ParamSelections;
	density?: Density;
	children: React.ReactNode;
}

function DesignSystemProvider({
	styles,
	tokens = {},
	params = {},
	density = "default",
	children,
}: DesignSystemProviderProps) {
	const value = React.useMemo(() => ({ styles, tokens, params, density }), [styles, tokens, params, density]);

	const cssVars = React.useMemo(() => {
		const vars: Record<string, string> = {};
		for (const [prop, val] of Object.entries(tokens)) {
			vars[prop] = resolveCssValue(val);
		}
		// Layer param-driven vars on top of tokens so they can override theme defaults.
		for (const [componentName, componentParams] of Object.entries(params)) {
			const componentVars = paramVarsRegistry.get(componentName);
			if (!componentVars) continue;
			for (const [paramName, paramValue] of Object.entries(componentParams)) {
				const valueVars = componentVars[paramName]?.[paramValue];
				if (!valueVars) continue;
				for (const [k, v] of Object.entries(valueVars)) {
					vars[k] = v;
				}
			}
		}
		return vars;
	}, [tokens, params]);

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
 * A single param value: an optional tv slice layered into the composition,
 * and/or an optional `vars` map written to `:root` by the provider (and
 * exported into globals.css at CLI install time).
 */
interface ParamValueConfig {
	tv?: TvConfig;
	vars?: Record<string, string>;
}

/**
 * Full createStyles config. Composition order per (density, params, aesthetic):
 *   base  →  density[d]  →  params[p1][v1].tv → … → params[pN][vN].tv  →  styles[a]
 *
 * `density`, `params`, and `styles` are optional. When `styles` is omitted,
 * an implicit `{ default: {} }` aesthetic is used and `meta.defaultStyle`
 * is not required. `params` are per-component variants whose values are
 * picked by the user in the customizer panel; their `vars` are injected
 * globally via the design system provider.
 */
interface CreateStylesConfig<Base extends TvConfig, StyleNames extends string> {
	base: Base;
	density?: Record<Density, TvConfig>;
	params?: Record<string, Record<string, ParamValueConfig>>;
	styles?: Record<StyleNames, TvConfig>;
}

function isNewShape(config: unknown): config is CreateStylesConfig<TvConfig, string> {
	if (!config || typeof config !== "object") return false;
	const c = config as Record<string, unknown>;
	return "base" in c && typeof c.base === "object" && c.base !== null;
}

interface CreateStylesMeta {
	name: string;
	defaultStyle?: string;
	styles?: Record<string, unknown>;
	params?: Record<string, { default: string; values: string[] }>;
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
// New shape with `styles`. Return type flows from merging base + the default
// style override so consumers see the real slot / variant keys.
function createStyles<const M extends CreateStylesMeta, const Base, const Styles extends Record<string, unknown>>(
	meta: M,
	config: {
		base: Base;
		density?: Record<Density, TvConfig>;
		params?: Record<string, Record<string, ParamValueConfig>>;
		styles: Styles;
	},
): {
	useStyles: () => InferTv<Base, Styles[M["defaultStyle"] & keyof Styles]>;
	styles: InferTv<Base, Styles[M["defaultStyle"] & keyof Styles]>;
};
// New shape without `styles`. An implicit `{ default: {} }` aesthetic is used.
function createStyles<const M extends CreateStylesMeta, const Base>(
	meta: M,
	config: {
		base: Base;
		density?: Record<Density, TvConfig>;
		params?: Record<string, Record<string, ParamValueConfig>>;
		styles?: undefined;
	},
): {
	useStyles: () => InferTv<Base, undefined>;
	styles: InferTv<Base, undefined>;
};
function createStyles(meta: CreateStylesMeta, config: any): any {
	if (isNewShape(config)) {
		const { base, density, params } = config;
		const styles: Record<string, TvConfig> = (config.styles as Record<string, TvConfig> | undefined) ?? {
			default: {},
		};
		const defaultStyleName = meta.defaultStyle ?? Object.keys(styles)[0]!;

		const paramNames = params ? Object.keys(params) : [];
		const paramDefaults: Record<string, string> = {};
		if (params) {
			for (const paramName of paramNames) {
				const fromMeta = meta.params?.[paramName]?.default;
				const firstValue = Object.keys(params[paramName] ?? {})[0];
				paramDefaults[paramName] = fromMeta ?? firstValue ?? "";
			}

			// Register CSS vars for every param value so the provider can
			// look them up when this component's selection changes.
			const componentVarsRegistry: Record<string, Record<string, Record<string, string>>> = {};
			for (const [paramName, paramValues] of Object.entries(params)) {
				const valueVars: Record<string, Record<string, string>> = {};
				let hasAny = false;
				for (const [valueName, valueConfig] of Object.entries(paramValues)) {
					if (valueConfig.vars && Object.keys(valueConfig.vars).length > 0) {
						valueVars[valueName] = valueConfig.vars;
						hasAny = true;
					}
				}
				if (hasAny) componentVarsRegistry[paramName] = valueVars;
			}
			if (Object.keys(componentVarsRegistry).length > 0) {
				paramVarsRegistry.set(meta.name, componentVarsRegistry);
			}
		}

		const baseTv = tv(base as never);

		// Precompute base→density per density (no params, no aesthetic) — used as
		// the foundation for runtime composition.
		const densities: Density[] = density ? (Object.keys(density) as Density[]) : ["default"];
		const densityTvs: Record<string, TvFn> = {};
		for (const d of densities) {
			densityTvs[d] = density ? tv({ extend: baseTv as never, ...(density[d] as TvConfig) } as never) : baseTv;
		}

		// Layered composition: base → density → params(in declared order) → styles
		function compose(d: Density, paramSelection: Record<string, string>, aesthetic: string): TvFn {
			let current: TvFn = densityTvs[d] ?? densityTvs.default!;
			if (params) {
				for (const paramName of paramNames) {
					const selectedValue = paramSelection[paramName] ?? paramDefaults[paramName]!;
					const valueConfig = params[paramName]?.[selectedValue];
					if (valueConfig?.tv) {
						current = tv({ extend: current as never, ...(valueConfig.tv as TvConfig) } as never);
					}
				}
			}
			const aestheticOverride = styles[aesthetic] ?? styles[defaultStyleName]!;
			return tv({ extend: current as never, ...(aestheticOverride as TvConfig) } as never);
		}

		function useStyles() {
			const { styles: selections, params: paramSelections, density } = React.useContext(DesignSystemContext);
			const aesthetic = selections[meta.name] ?? defaultStyleName;
			const componentParams = paramSelections[meta.name] ?? {};
			const paramSig = paramNames.map((k) => componentParams[k] ?? paramDefaults[k]).join("|");
			return React.useMemo(
				() => compose(density, componentParams, aesthetic),
				// eslint-disable-next-line react-hooks/exhaustive-deps
				[density, paramSig, aesthetic],
			);
		}

		return {
			useStyles,
			styles: compose("default", paramDefaults, defaultStyleName),
		};
	}

	const stylesMap = config as Record<string, TvFn>;
	const fallback = meta.defaultStyle ?? Object.keys(stylesMap)[0]!;
	function useStyles() {
		const { styles: selections } = React.useContext(DesignSystemContext);
		const selected = selections[meta.name];
		if (selected && selected in stylesMap) {
			return stylesMap[selected]!;
		}
		return stylesMap[fallback]!;
	}
	return { useStyles };
}

export type { VariantProps };
export { createStyles, DesignSystemContext, DesignSystemProvider };
