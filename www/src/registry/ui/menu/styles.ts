import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import menuMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		item: "",
		section: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: [
			"max-h-[inherit] rounded-[inherit] p-1 outline-hidden",
			"group-data-[type=drawer]/overlay:p-2",
			"[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
		],
		item: [
			"flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:text-fg-disabled",
			"selection-multiple:pl-0 selection-single:pl-0",
			"group-data-[slot=drawer]/overlay:py-3 group-data-[slot=drawer]/overlay:text-base",
			"group-data-[slot=modal]/overlay:py-2 group-data-[slot=modal]/overlay:text-base",
			"[&_svg]:size-4",
			"[&_kbd]:bg-transparent [&_kbd]:text-fg-muted",
		],
		section: "space-y-px pt-2",
	},
	variants: {
		variant: {
			default: {
				item: "text-fg",
			},
			success: {
				item: "text-fg-success",
			},
			warning: {
				item: "text-fg-warning",
			},
			accent: {
				item: "text-fg-accent",
			},
			danger: {
				item: "text-fg-danger",
			},
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export type MenuStyles = typeof defaultStyles;

export const { useStyles } = createStyles(menuMeta, {
	default: defaultStyles,
});
