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
