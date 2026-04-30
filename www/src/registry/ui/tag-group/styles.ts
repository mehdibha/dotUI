import { createStyles } from "@/modules/core/styles";

import tagGroupMeta from "./meta";

const { useStyles, styles } = createStyles(tagGroupMeta, {
	base: {
		slots: {
			tagGroup: [
				"flex flex-col gap-2",
			],
			tagList: ["flex flex-wrap items-center outline-hidden", "empty:text-fg-muted", "gap-1"],
			tag: [
				"group/tag relative inline-flex w-fit shrink-0 cursor-default select-none items-center justify-center whitespace-nowrap rounded-(--tag-radius) bg-clip-padding font-medium outline-hidden transition-colors",
				"bg-(--neutral-300) selected:bg-accent selected:text-fg-on-accent text-fg-on-neutral",
				// svg
				"**:[svg]:pointer-events-none **:[svg]:shrink-0",
				// focus
				"focus-visible:focus-ring",
				// link variant (when href)
				"data-href:cursor-interactive",
				// disabled
				"disabled:pointer-events-none disabled:bg-disabled disabled:text-fg-disabled",

				"h-5 gap-1 px-1.5 text-xs/relaxed **:[svg]:not-with-[size]:size-3",
				// remove button
				"has-[button[slot=remove]]:pr-0.5 **:[button[slot=remove]]:size-4 **:[button[slot=remove]]:rounded-full",
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
