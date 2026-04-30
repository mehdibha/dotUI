import { createStyles } from "@/modules/core/styles";

import tagGroupMeta from "./meta";

const { useStyles, styles } = createStyles(tagGroupMeta, {
	base: {
		slots: {
			tagGroup: "flex flex-col gap-2",
			tagList: [
				"flex flex-wrap items-center outline-hidden",
				"orientation-vertical:flex-col orientation-vertical:items-start",
				"data-empty:text-fg-muted data-empty:text-sm",
			],
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
				"disabled:pointer-events-none disabled:opacity-50",
				// remove button slot — tighten right side spacing
				"has-data-[slot=remove]:pr-0.5",
				// remove button styling tweaks (overrides Button quiet defaults)
				"*:[button][slot=remove]:-mr-1 *:[button][slot=remove]:bg-transparent *:[button][slot=remove]:opacity-60 hover:*:[button][slot=remove]:opacity-100",
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
		compact: {
			slots: {
				list: "gap-1",
			},
			variants: {
				size: {
					sm: { tag: "h-4 gap-0.5 px-1.5 text-[0.625rem] **:[svg]:not-with-[size]:size-2.5" },
					md: { tag: "h-5 gap-1 px-1.5 text-xs/relaxed **:[svg]:not-with-[size]:size-3" },
					lg: { tag: "h-6 gap-1 px-2 text-xs **:[svg]:not-with-[size]:size-3.5" },
				},
			},
		},
		default: {
			slots: {
				list: "gap-1.5",
			},
			variants: {
				size: {
					sm: { tag: "h-5 gap-1 px-1.5 text-xs/relaxed **:[svg]:not-with-[size]:size-3" },
					md: { tag: "h-6 gap-1 px-2 text-xs **:[svg]:not-with-[size]:size-3.5" },
					lg: { tag: "h-7 gap-1.5 px-2.5 text-sm **:[svg]:not-with-[size]:size-4" },
				},
			},
		},
		comfortable: {
			slots: {
				list: "gap-2",
			},
			variants: {
				size: {
					sm: { tag: "h-6 gap-1 px-2 text-xs **:[svg]:not-with-[size]:size-3.5" },
					md: { tag: "h-7 gap-1.5 px-2.5 text-sm **:[svg]:not-with-[size]:size-4" },
					lg: { tag: "h-8 gap-1.5 px-3 text-sm **:[svg]:not-with-[size]:size-4" },
				},
			},
		},
	},
});

export type TagGroupStyles = typeof styles;

export { useStyles };
