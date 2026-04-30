import { createStyles } from "@/modules/core/styles";

import colorSwatchPickerMeta from "./meta";

const { useStyles, styles } = createStyles(colorSwatchPickerMeta, {
	base: {
		slots: {
			root: "flex flex-wrap",
			item: [
				"relative rounded-(--color-swatch-picker-item-radius) transition-shadow focus:z-10 *:data-[slot=color-swatch]:size-full *:data-[slot=color-swatch]:rounded-[inherit]",
				"focus-reset focus-visible:focus-ring",
				"disabled:cursor-not-allowed disabled:*:data-[slot=color-swatch]:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]!",
				"before:absolute before:inset-0 before:scale-90 selected:before:scale-100 before:rounded-[inherit] before:bg-bg before:opacity-0 selected:before:opacity-100 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:duration-100 before:content-['']",
			],
		},
	},
	density: {
		compact: {
			slots: {
				root: "gap-0.5",
				item: "size-6",
			},
		},
		default: {
			slots: {
				root: "gap-1",
				item: "size-8",
			},
		},
		comfortable: {
			slots: {
				root: "gap-1.5",
				item: "size-10",
			},
		},
	},
});

export type ColorSwatchPickerStyles = typeof styles;

export { useStyles };
