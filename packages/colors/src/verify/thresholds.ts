import type { ContrastFormula } from "../shared/color";
import type { SizeClass } from "./types";

/** WCAG 2 AA / AAA minimums by size class. */
const WCAG2_AA: Record<SizeClass, number> = { body: 4.5, large: 3, nonText: 3 };
const WCAG2_AAA: Record<SizeClass, number> = { body: 7, large: 4.5, nonText: 4.5 };
/** APCA Lc AA / AAA targets by size class. */
const APCA_AA: Record<SizeClass, number> = { body: 60, large: 45, nonText: 30 };
const APCA_AAA: Record<SizeClass, number> = { body: 75, large: 60, nonText: 45 };

/** The AA (minimum) target for a size class + formula. */
export function targetFor(sizeClass: SizeClass, formula: ContrastFormula): number {
	return (formula === "apca" ? APCA_AA : WCAG2_AA)[sizeClass];
}

/** The AAA target for a size class + formula. */
export function targetAAA(sizeClass: SizeClass, formula: ContrastFormula): number {
	return (formula === "apca" ? APCA_AAA : WCAG2_AAA)[sizeClass];
}

/**
 * Cheap OKLCH-lightness pre-check: a |ΔL| this large clears the AA ratio, so the
 * real (more expensive) contrast call can be skipped for obviously-fine pairs.
 */
export function deltaLClearsAA(fgL: number, bgL: number, sizeClass: SizeClass): boolean {
	const d = Math.abs(fgL - bgL);
	return sizeClass === "body" ? d >= 0.5 : d >= 0.4;
}
