import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import colorSwatchPickerMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		item: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: "flex flex-wrap gap-1",
		item: [
			"relative size-8 rounded-md transition-shadow focus:z-10 *:data-[slot=color-swatch]:size-full *:data-[slot=color-swatch]:rounded-[inherit]",
			// focus state
			"focus-reset focus-visible:focus-ring",
			// disabled state
			"disabled:cursor-not-allowed disabled:*:data-[slot=color-swatch]:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]!",
			// selected state
			"before:absolute before:inset-0 before:scale-90 selected:before:scale-100 before:rounded-[inherit] before:bg-bg before:opacity-0 selected:before:opacity-100 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:duration-100 before:content-['']",
		],
	},
});

export type ColorSwatchPickerStyles = typeof defaultStyles;

export const { useStyles } = createStyles(colorSwatchPickerMeta, {
	default: defaultStyles,
});
