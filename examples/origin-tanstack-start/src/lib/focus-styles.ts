import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "outline-hidden focus-visible:focus-ring",
});

export const focusInput = tv({
  base: "focus-within:border-border-focus focus-within:focus-input",
});

export const focusRingGroup = tv({
  base: "outline-hidden group-focus-visible:focus-ring",
});
