import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "outline-none ring-0 ring-border-focus forced-colors:ring-[Highlight] focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-2",
});

// TODO CHANGE TO RING

export const focusInput = tv({
  // base: "outline focus:outline-border-focus forced-colors:outline-[Highlight] outline-0 focus:outline-2",
  base: "ring-0 focus-within:ring-border-focus forced-colors:outline-[Highlight] focus-within:ring-2",
});
