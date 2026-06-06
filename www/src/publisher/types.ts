/**
 * Types for the publish pipeline.
 *
 * `StylesConfig` mirrors the shape of the object passed to `createStyles(meta, …)`
 * in each component's `styles.ts`. At build time it is extracted as a plain JSON
 * literal (no React, no `tv`). At request time it is folded with a preset into
 * a flat `tv` config, then serialized.
 */

import type { ColorConfig } from "@/registry/theme";
import type { Density, RegistryItem, RegistryItemFile } from "@/registry/types";

/**
 * A class value in a `tv` config. `tv` accepts more shapes (booleans, conditionals)
 * but we only emit string / string-array forms from `styles.ts` files.
 */
export type ClassValue = string | string[] | null | undefined | false;

/**
 * A value within `variants[variantName][valueName]`. Either a flat class
 * (when base has no slots) or a per-slot map (when base declares slots).
 */
export type VariantSliceValue = ClassValue | Record<string, ClassValue>;

export interface CompoundVariant {
	[variantName: string]: unknown;
}

/** One layer of a tv config. Both base and any override (density, param value) use this shape. */
export interface TvLayer {
	base?: ClassValue;
	slots?: Record<string, ClassValue>;
	variants?: Record<string, Record<string, VariantSliceValue>>;
	defaultVariants?: Record<string, string>;
	compoundVariants?: CompoundVariant[];
}

/** An override layer additionally carries `vars`, which are dropped at publish. */
export interface OverrideLayer extends TvLayer {
	vars?: Record<string, string>;
}

/** The plain-JSON extract of a component's `styles.ts` config. */
export interface StylesConfig {
	base: TvLayer;
	density?: Partial<Record<Density, OverrideLayer>>;
	params?: Record<string, Record<string, OverrideLayer>>;
}

/**
 * Build-time output for one component. Stored in
 * `www/src/registry/__generated__/publishables/<name>.ts`.
 *
 * - `template` — `base.tsx` source with `useStyles()` stripped, `tv` imported,
 *   and a `%%TV_CONFIG%%` placeholder where the resolved config gets injected.
 * - `stylesConfig` — the plain-JSON extract.
 * - `meta` — the shadcn-shaped registry item meta (params kept on this side
 *   only so the request-time path can read scalar param definitions for the
 *   class rewriter; they're dropped from the emitted shadcn JSON).
 */
export interface Publishable {
	template: string;
	stylesConfig: StylesConfig;
	meta: RegistryItem;
}

/** The preset slice the publisher needs. */
export interface PublishPreset {
	density: Density;
	/** Per-component param selections: { button: { variant: "primary", ... } } */
	componentParams: Record<string, Record<string, string>>;
	/** Generative color recipe; when present, its ramps override the static base palette. */
	color?: ColorConfig;
}

/** Subset of `RegistryItemFile` we emit. */
export type EmittedFile = RegistryItemFile;
