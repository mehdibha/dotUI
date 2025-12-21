// Local types for the style-editor UI shell
// These are simplified versions - no persistence, just for rendering

export type ScaleId = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];
