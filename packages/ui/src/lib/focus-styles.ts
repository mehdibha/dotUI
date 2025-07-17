import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "ring-0 ring-border-focus outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
});

export const focusRingGroup = tv({
  base: "ring-0 ring-border-focus outline-hidden group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg",
});

export const focusInput = tv({
  base: "ring-0 focus-within:ring-2 focus-within:ring-border-focus",
});

export const focusVariants = {
  default: {
    ring: tv({
      base: "ring-0 ring-border-focus outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    }),
    group: tv({
      base: "ring-0 ring-border-focus outline-hidden group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg",
    }),
    input: tv({
      base: "ring-0 focus-within:ring-2 focus-within:ring-border-focus",
    }),
  },
  subtle: {
    ring: tv({
      base: "ring-0 ring-border-focus/50 outline-hidden focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
    }),
    group: tv({
      base: "ring-0 ring-border-focus/50 outline-hidden group-focus-visible:ring-1 group-focus-visible:ring-offset-1 group-focus-visible:ring-offset-bg",
    }),
    input: tv({
      base: "ring-0 focus-within:ring-1 focus-within:ring-border-focus/50",
    }),
  },
  bold: {
    ring: tv({
      base: "shadow-lg ring-0 ring-border-focus outline-hidden focus-visible:ring-4 focus-visible:shadow-border-focus/25 focus-visible:ring-offset-4 focus-visible:ring-offset-bg",
    }),
    group: tv({
      base: "shadow-lg ring-0 ring-border-focus outline-hidden group-focus-visible:ring-4 group-focus-visible:shadow-border-focus/25 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-bg",
    }),
    input: tv({
      base: "shadow-lg ring-0 focus-within:ring-4 focus-within:shadow-border-focus/25 focus-within:ring-border-focus",
    }),
  },
  glow: {
    ring: tv({
      base: "ring-0 outline-hidden focus-visible:shadow-[0_0_12px_theme(colors.border.focus/0.5)] focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-0",
    }),
    group: tv({
      base: "ring-0 outline-hidden group-focus-visible:shadow-[0_0_12px_theme(colors.border.focus/0.5)] group-focus-visible:ring-2 group-focus-visible:ring-border-focus group-focus-visible:ring-offset-0",
    }),
    input: tv({
      base: "ring-0 focus-within:shadow-[0_0_12px_theme(colors.border.focus/0.5)] focus-within:ring-2 focus-within:ring-border-focus",
    }),
  },
  minimal: {
    ring: tv({
      base: "ring-0 outline-hidden focus-visible:border-border-focus focus-visible:bg-bg-inverse/5",
    }),
    group: tv({
      base: "ring-0 outline-hidden group-focus-visible:border-border-focus group-focus-visible:bg-bg-inverse/5",
    }),
    input: tv({
      base: "ring-0 focus-within:border-border-focus focus-within:bg-bg-inverse/5",
    }),
  },
};

export type FocusVariant = keyof typeof focusVariants;
