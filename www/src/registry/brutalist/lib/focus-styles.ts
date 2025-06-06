import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "ring-border-focus focus-visible:ring-offset-bg ring-0 outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2",
});

export const focusRingGroup = tv({
  base: "ring-border-focus group-focus-visible:ring-offset-bg ring-0 outline-hidden group-focus-visible:ring-2 group-focus-visible:ring-offset-2",
});

export const focusInput = tv({
  base: "focus-within:ring-border-focus ring-0 focus-within:ring-2",
});
