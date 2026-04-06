import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import colorThumbMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: [
		"focus-reset focus-visible:focus-ring",
		"z-30 size-6 rounded-full border-2 border-white ring-1 ring-black/40 disabled:border-border-disabled disabled:bg-disabled!",
		"group-orientation-horizontal/color-slider:top-1/2 group-orientation-vertical/color-slider:left-1/2",
	],
});

export type ColorThumbStyles = typeof defaultStyles;

export const { useStyles } = createStyles(colorThumbMeta, {
	default: defaultStyles,
});
