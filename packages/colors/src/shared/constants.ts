export const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];

export const SEMANTIC_COLORS: Record<string, string> = {
	success: "#22c55e",
	danger: "#ef4444",
	warning: "#eab308",
	info: "#3b82f6",
};

export const DEFAULT_MODES = {
	light: true,
	dark: true,
} as const;
