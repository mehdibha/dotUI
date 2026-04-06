import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import colorAreaMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: "block size-48 min-w-20 rounded-md disabled:[background:var(--color-disabled)]!",
});

export type ColorAreaStyles = typeof defaultStyles;

export const { useStyles } = createStyles(colorAreaMeta, {
	default: defaultStyles,
});
