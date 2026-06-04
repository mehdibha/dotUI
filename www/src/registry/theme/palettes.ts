/**
 * Palette identity — the single source for which palettes exist, in what order,
 * and how dotUI's `accent` maps to the kernel's `primary`. Imported by the
 * resolver, the codec, and the customizer so none of them re-declare the list.
 */

/** Emission + display order for every palette dotUI generates. */
export const PALETTE_ORDER = ["neutral", "accent", "success", "warning", "danger", "info"] as const;

/** The optional status palettes (everything but the neutral backbone + brand accent). */
export const STATUS_PALETTES = ["success", "warning", "danger", "info"] as const;

export type PaletteName = (typeof PALETTE_ORDER)[number];

/** The kernel names the brand palette `primary`; dotUI calls it `accent`. */
export const ACCENT_KERNEL_NAME = "primary";

/** Map a dotUI palette name to the kernel's (`accent` → `primary`). */
export const toKernelPaletteName = (name: string): string => (name === "accent" ? ACCENT_KERNEL_NAME : name);

/** Map a kernel palette name back to dotUI's (`primary` → `accent`). */
export const fromKernelPaletteName = (name: string): string => (name === ACCENT_KERNEL_NAME ? "accent" : name);
