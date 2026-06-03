import type { ContrastFormula } from "../shared/color";

/** Pairing size class — drives the required contrast (Material's ContrastCurve insight). */
export type SizeClass = "body" | "large" | "nonText";

/** A foreground/background pairing to verify (resolved color values). */
export interface SemanticPairing {
	name: string;
	fg: string;
	bg: string;
	sizeClass?: SizeClass;
}

export type Level = "fail" | "AA" | "AAA";

export interface PairingResult {
	name: string;
	fg: string;
	bg: string;
	sizeClass: SizeClass;
	formula: ContrastFormula;
	ratio: number;
	target: number;
	level: Level;
	meets: boolean;
	/** A foreground (fg with adjusted lightness) that clears the AA target, if one exists. */
	suggestedFg?: string;
}

export interface VerifyReport {
	results: PairingResult[];
	failures: PairingResult[];
	passed: boolean;
}

export interface VerifyOptions {
	formula?: ContrastFormula;
	/** Compute a `suggestedFg` for failing pairings (default true). */
	suggestFix?: boolean;
}
