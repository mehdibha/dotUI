import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "focus-visible:ring-border-focus focus-visible:ring-offset-bg outline-hidden ring-0 transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-offset-2",
});

export const focusRingGroup = tv({
  base: "ring-border-focus group-focus-visible:ring-offset-bg outline-hidden ring-0 group-focus-visible:ring-2 group-focus-visible:ring-offset-2",
});

export const focusInput = tv({
  base: "focus-within:ring-border-focus ring-0 focus-within:ring-2",
});
