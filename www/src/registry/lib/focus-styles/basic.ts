import { tv } from "tailwind-variants";

export const focusRing = tv({
	base: "outline-hidden ring-0 ring-border-focus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
});

export const focusInput = tv({
	base: "ring-0 focus-within:ring-2 focus-within:ring-border-focus",
});

export const focusRingGroup = tv({
	base: "outline-hidden ring-0 ring-border-focus group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg",
});
