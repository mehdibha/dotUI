"use client";

import * as React from "react";

import { tv } from "tailwind-variants";

import type { ClassValue, TVReturnType, VariantProps } from "tailwind-variants";

import { emitPrimitivesCss, resolveColorConfig } from "@/registry/theme";

import type { ColorConfig } from "@/registry/theme";
import type { Density, EnumParamDef, ParamDef, RegistryItem } from "@/registry/types";

/* --------------------------------- Types --------------------------------- */

type ParamSelections = Record<string, Record<string, string>>;
type GlobalTokenSelections = Record<string, string>;

interface DesignSystemContextValue {
	params: ParamSelections;
	tokens: GlobalTokenSelections;
	density: Density;
}

/* -------------------------------- Context -------------------------------- */

const DesignSystemContext = React.createContext<DesignSystemContextValue>({
	params: {},
	tokens: {},
	density: "default",
});

/* ----------------------------- Param registry ----------------------------- */

/**
 * Module-scoped registry populated by `createStyles` at module load. The
 * provider reads it to resolve the user's per-component selections into CSS
 * vars on `:root`. Two kinds:
 *   - enum vars: `{ [component]: { [paramName]: { [valueName]: vars } } }`
 *   - scalar bindings: `{ [component]: { [paramName]: cssVar } }`
 */
const enumVarsRegistry = new Map<string, Record<string, Record<string, Record<string, string>>>>();
const scalarVarsRegistry = new Map<string, Record<string, string>>();
const emptyParamSelections: Record<string, string> = {};

/* -------------------------------- Provider ------------------------------- */

/** Resolve a token value to a CSS value. "--radius-md" → "var(--radius-md)", "0" → "0" */
function resolveCssValue(value: string): string {
	return value.startsWith("--") ? `var(${value})` : value;
}

interface DesignSystemProviderProps {
	params?: ParamSelections;
	tokens?: GlobalTokenSelections;
	density?: Density;
	color?: ColorConfig;
	children: React.ReactNode;
}

function DesignSystemProvider({
	params = {},
	tokens = {},
	density = "default",
	color,
	children,
}: DesignSystemProviderProps) {
	const value = React.useMemo(() => ({ params, tokens, density }), [params, tokens, density]);

	const cssVars = React.useMemo(() => {
		const vars: Record<string, string> = {};

		// Layer 1: global theme tokens (palette, radius factor, cursors, etc.).
		for (const [prop, val] of Object.entries(tokens)) {
			vars[prop] = resolveCssValue(val);
		}

		// Layer 2: per-component param selections.
		// Enum params write a value's `vars` block; scalar params write a single
		// CSS var resolved from the selected token reference.
		for (const [componentName, componentSelections] of Object.entries(params)) {
			const enumVars = enumVarsRegistry.get(componentName);
			const scalarBindings = scalarVarsRegistry.get(componentName);
			for (const [paramName, paramValue] of Object.entries(componentSelections)) {
				const enumValueVars = enumVars?.[paramName]?.[paramValue];
				if (enumValueVars) {
					for (const [k, v] of Object.entries(enumValueVars)) {
						vars[k] = v;
					}
					continue;
				}
				const scalarCssVar = scalarBindings?.[paramName];
				if (scalarCssVar) {
					vars[scalarCssVar] = resolveCssValue(paramValue);
				}
			}
		}

		return vars;
	}, [tokens, params]);

	// Apply CSS custom properties to :root so values that reference each
	// other via calc() + var() (e.g. --radius-sm = calc(.25rem * var(--radius-factor)))
	// recompute correctly. Setting on a wrapper <div> would freeze them at
	// declaration time at :root.
	React.useLayoutEffect(() => {
		const root = document.documentElement;
		const applied = Object.entries(cssVars);
		for (const [key, value] of applied) {
			root.style.setProperty(key, value);
		}
		return () => {
			for (const [key] of applied) {
				root.style.removeProperty(key);
			}
		};
	}, [cssVars]);

	// Generative palette: inject the resolved per-mode primitive ramps as a <style>
	// (the flat-token path above only writes :root; this carries :root + .dark).
	const colorCss = React.useMemo(
		() => (color ? emitPrimitivesCss(resolveColorConfig(color), { onColors: true }) : null),
		[color],
	);

	React.useLayoutEffect(() => {
		if (!colorCss) return;
		const styleEl = document.createElement("style");
		styleEl.setAttribute("data-dotui-color", "");
		styleEl.textContent = colorCss;
		document.head.appendChild(styleEl);
		return () => {
			styleEl.remove();
		};
	}, [colorCss]);

	return <DesignSystemContext.Provider value={value}>{children}</DesignSystemContext.Provider>;
}

function useComponentParams(componentName: string): Record<string, string> {
	const { params } = React.useContext(DesignSystemContext);
	return params[componentName] ?? {};
}

interface DynamicComponentConfig<Props extends object, Value extends string> {
	componentName: string;
	paramName: string;
	defaultValue: Value;
	components: Record<Value, React.ComponentType<Props>>;
	displayName?: string;
}

function createDynamicComponent<Props extends object, const Value extends string>({
	componentName,
	paramName,
	defaultValue,
	components,
	displayName,
}: DynamicComponentConfig<Props, Value>) {
	function DynamicComponent(props: Props) {
		const componentParams = useComponentParams(componentName);
		const selectedValue = componentParams[paramName];
		const Component =
			selectedValue && Object.hasOwn(components, selectedValue)
				? components[selectedValue as Value]
				: components[defaultValue];

		return React.createElement(Component, props);
	}

	DynamicComponent.displayName = displayName ?? `Dynamic(${componentName}.${paramName})`;

	return DynamicComponent;
}

/* ------------------------------ createStyles ----------------------------- */

/**
 * Strict tv-config override type. Any layer above `base` (density, param values)
 * must match base's shape exactly:
 *   - same slot keys (no new slots)
 *   - same variant keys (no new variants)
 *   - same variant value keys per variant
 *   - variant values may be ClassValue, or — when base has slots — a partial
 *     slot map keyed by base's slots.
 */
type SlotKeys<Base> = Base extends { slots: infer S }
	? S extends Record<string, unknown>
		? Extract<keyof S, string>
		: never
	: never;

type VariantKeys<Base> = Base extends { variants: infer V }
	? V extends Record<string, unknown>
		? Extract<keyof V, string>
		: never
	: never;

type VariantValueKeys<Base, K extends PropertyKey> = Base extends {
	variants: { [P in K]: infer VV };
}
	? VV extends Record<string, unknown>
		? Extract<keyof VV, string>
		: never
	: never;

type HasSlots<Base> = [SlotKeys<Base>] extends [never] ? false : true;
type HasVariants<Base> = [VariantKeys<Base>] extends [never] ? false : true;

type SlotsOverride<Base> =
	HasSlots<Base> extends true ? { slots?: { [K in SlotKeys<Base>]?: ClassValue } } : { slots?: never };

type VariantValueOverride<Base> =
	HasSlots<Base> extends true ? ClassValue | { [S in SlotKeys<Base>]?: ClassValue } : ClassValue;

type VariantsOverride<Base> =
	HasVariants<Base> extends true
		? {
				variants?: {
					[K in VariantKeys<Base>]?: {
						[V in VariantValueKeys<Base, K>]?: VariantValueOverride<Base>;
					};
				};
				defaultVariants?: { [K in VariantKeys<Base>]?: VariantValueKeys<Base, K> };
			}
		: { variants?: never; defaultVariants?: never };

type CompoundVariantsOverride<Base> =
	HasVariants<Base> extends true
		? {
				compoundVariants?: Array<
					{
						[K in VariantKeys<Base>]?: VariantValueKeys<Base, K> | VariantValueKeys<Base, K>[];
					} & {
						class?: ClassValue;
						className?: ClassValue;
					}
				>;
			}
		: { compoundVariants?: never };

export type ExtendingTv<Base> = { base?: ClassValue } & SlotsOverride<Base> &
	VariantsOverride<Base> &
	CompoundVariantsOverride<Base>;

/* ----- Meta-driven param shape inference ----- */

type EnumParamNamesOf<M> = M extends { params: infer P }
	? P extends Record<string, ParamDef>
		? { [K in keyof P]: P[K] extends EnumParamDef ? K : never }[keyof P]
		: never
	: never;

type EnumParamValuesOf<M, K extends PropertyKey> = M extends {
	params: { [P in K]: infer Def };
}
	? Def extends EnumParamDef
		? Def["values"][number]
		: never
	: never;

type EnumParamsConfig<M, Base> = [EnumParamNamesOf<M>] extends [never]
	? { params?: never }
	: {
			params?: {
				[K in EnumParamNamesOf<M>]?: {
					[V in EnumParamValuesOf<M, K> & string]?: ExtendingTv<Base> & {
						vars?: Record<string, string>;
					};
				};
			};
		};

/* ----- useStyles return type ----- */

type EmptyVariants = Record<never, never>;
type ExtractVariants<Base> = Base extends { variants: infer V } ? V : EmptyVariants;
type ExtractSlots<Base> = Base extends { slots: infer S } ? S : undefined;
type ExtractBase<Base> = Base extends { base: infer B } ? B : undefined;

type InferTv<Base> = TVReturnType<
	// @ts-expect-error — ExtractVariants<Base> may not exactly match the constrained TVVariants shape
	ExtractVariants<Base>,
	ExtractSlots<Base>,
	ExtractBase<Base>,
	EmptyVariants,
	undefined
>;

/* ----- createStyles ----- */

type CreateStylesConfig<M, Base> = {
	base: Base;
	density?: Record<Density, ExtendingTv<Base>>;
} & EnumParamsConfig<M, Base>;

function createStyles<const M extends RegistryItem, const Base>(
	meta: M,
	config: CreateStylesConfig<M, Base>,
): {
	useStyles: () => InferTv<Base>;
	styles: InferTv<Base>;
} {
	const { base, density, params } = config as {
		base: Base;
		density?: Record<Density, Record<string, unknown>>;
		params?: Record<string, Record<string, Record<string, unknown> & { vars?: Record<string, string> }>>;
	};

	/* ----- Register param vars / scalar bindings into runtime registry ----- */
	const metaParams = (meta.params ?? {}) as Record<string, ParamDef>;
	const enumParamNames: string[] = [];
	const paramDefaults: Record<string, string> = {};

	const enumVarsForComponent: Record<string, Record<string, Record<string, string>>> = {};
	const scalarBindingsForComponent: Record<string, string> = {};

	for (const [paramName, def] of Object.entries(metaParams)) {
		paramDefaults[paramName] = def.default;
		if (def.kind === "enum") {
			enumParamNames.push(paramName);
			const valueVarsByValue: Record<string, Record<string, string>> = {};
			const valuesConfig = (params?.[paramName] ?? {}) as Record<string, { vars?: Record<string, string> }>;
			let hasAny = false;
			for (const [valueName, valueConfig] of Object.entries(valuesConfig)) {
				if (valueConfig?.vars && Object.keys(valueConfig.vars).length > 0) {
					valueVarsByValue[valueName] = valueConfig.vars;
					hasAny = true;
				}
			}
			if (hasAny) enumVarsForComponent[paramName] = valueVarsByValue;
		} else if (def.kind === "scalar") {
			scalarBindingsForComponent[paramName] = def.cssVar;
		}
	}

	if (Object.keys(enumVarsForComponent).length > 0) {
		enumVarsRegistry.set(meta.name, enumVarsForComponent);
	}
	if (Object.keys(scalarBindingsForComponent).length > 0) {
		scalarVarsRegistry.set(meta.name, scalarBindingsForComponent);
	}

	/* ----- Build per-density tv functions ----- */
	type AnyTv = ReturnType<typeof tv>;
	const baseTv = tv(base as Parameters<typeof tv>[0]) as unknown as AnyTv;

	const densities: Density[] = ["compact", "default", "comfortable"];
	const densityTvs: Record<string, AnyTv> = {};
	for (const d of densities) {
		const densityConfig = density?.[d];
		densityTvs[d] = densityConfig
			? (tv({ extend: baseTv as never, ...(densityConfig as Parameters<typeof tv>[0]) } as never) as AnyTv)
			: baseTv;
	}

	/* ----- Composition: base → density → params(in declared order) ----- */
	function stripVars<T extends { vars?: unknown }>(input: T): Omit<T, "vars"> {
		// tv() can't see the `vars` key, so drop it before passing through.
		const { vars: _vars, ...rest } = input;
		return rest as Omit<T, "vars">;
	}

	function compose(d: Density, paramSelection: Record<string, string>): ReturnType<typeof tv> {
		const defaultTv = densityTvs.default ?? baseTv;
		let current: ReturnType<typeof tv> = densityTvs[d] ?? defaultTv;
		for (const paramName of enumParamNames) {
			const selectedValue = paramSelection[paramName] ?? paramDefaults[paramName];
			if (!selectedValue) continue;
			const valueConfig = params?.[paramName]?.[selectedValue];
			if (!valueConfig) continue;
			const tvOverride = stripVars(valueConfig);
			if (Object.keys(tvOverride).length === 0) continue;
			current = tv({ extend: current as never, ...(tvOverride as Parameters<typeof tv>[0]) } as never);
		}
		return current;
	}

	function useStyles() {
		const { params: paramSelections, density } = React.useContext(DesignSystemContext);
		const componentParams = paramSelections[meta.name] ?? emptyParamSelections;
		return React.useMemo(() => compose(density, componentParams) as InferTv<Base>, [density, componentParams]);
	}

	return {
		useStyles,
		styles: compose("default", paramDefaults) as InferTv<Base>,
	};
}

export type { VariantProps };
export { createDynamicComponent, createStyles, DesignSystemContext, DesignSystemProvider, useComponentParams };
