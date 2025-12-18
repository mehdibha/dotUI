import type { ModeVariant } from "./types";

export const DEFAULT_LIGHT_TONES = [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10];

export const DEFAULT_DARK_TONES = [10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95];

export const DEFAULT_VARIANT: ModeVariant = "tonalSpot";

export const DEFAULT_CONTRAST = 0;

export const SEMANTIC_COLORS: Record<string, string> = {
	success: "#22c55e",
	danger: "#ef4444",
	warning: "#eab308",
	info: "#3b82f6",
};

export const NEUTRAL_CHROMA = 6;
