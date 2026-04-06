import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import colorSwatchMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: "relative size-5 shrink-0 rounded-sm border",
});

export type ColorSwatchStyles = typeof defaultStyles;

export const { useStyles } = createStyles(colorSwatchMeta, {
	default: defaultStyles,
});
