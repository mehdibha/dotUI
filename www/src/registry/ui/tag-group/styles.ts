import { createStyles } from "@/modules/core/styles";

import tagGroupMeta from "./meta";

const { useStyles, styles } = createStyles(tagGroupMeta, {
	base: {
		slots: {
			tagGroup: ["flex flex-col gap-2"],
			tagList: ["flex flex-wrap items-center outline-hidden", "empty:text-fg-muted", "gap-1"],
			tag: [
				"group/tag relative inline-flex w-fit shrink-0 cursor-default select-none items-center justify-center whitespace-nowrap rounded-(--tag-radius) font-medium outline-hidden transition-colors data-react-aria-pressable:cursor-interactive",
				"bg-(--neutral-300) selected:bg-accent-muted selected:text-fg-accent text-fg-on-neutral",
				// svg
				"**:[svg]:pointer-events-none **:[svg]:shrink-0",
				// focus
				"focus-visible:focus-ring",
				// link variant (when href)
				"data-href:cursor-interactive",
				// disabled
				"disabled:bg-disabled disabled:text-fg-disabled data-selection-mode:disabled:cursor-disabled",

				"h-5 gap-1 px-1.5 text-xs/relaxed **:[svg]:not-with-[size]:size-3",
				// remove button
				"has-[button[slot=remove]]:pr-0 **:[button[slot=remove]]:-ml-1 **:[button[slot=remove]]:size-5 **:[button[slot=remove]]:rounded-none **:[button[slot=remove]]:bg-transparent **:[button[slot=remove]]:text-fg-muted **:[button[slot=remove]]:hover:text-fg",
			],
		},
		variants: {
			size: {
				sm: {},
				md: {},
				lg: {},
			},
		},
		defaultVariants: {
			size: "md",
		},
	},

	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type TagGroupStyles = typeof styles;

export { useStyles };
