// Scale steps for color generation
export const SCALE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

// Radius tokens with their default values
export const RADIUS_TOKENS: Record<string, { defaultValue: string }> = {
  "radius-xs": { defaultValue: "calc(0.125rem * var(--radius-factor))" },
  "radius-sm": { defaultValue: "calc(0.25rem * var(--radius-factor))" },
  "radius-md": { defaultValue: "calc(0.375rem * var(--radius-factor))" },
  "radius-lg": { defaultValue: "calc(0.5rem * var(--radius-factor))" },
  "radius-xl": { defaultValue: "calc(0.75rem * var(--radius-factor))" },
  "radius-2xl": { defaultValue: "calc(1rem * var(--radius-factor))" },
  "radius-3xl": { defaultValue: "calc(1.5rem * var(--radius-factor))" },
  "radius-4xl": { defaultValue: "calc(2rem * var(--radius-factor))" },
};
