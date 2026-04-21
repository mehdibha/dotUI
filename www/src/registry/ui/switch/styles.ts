import { createStyles } from "@/modules/core/styles";

import switchMeta from "./meta";

const { useStyles, styles } = createStyles(switchMeta, {
	base: {
		slots: {
			root: "",
			indicator: "",
			thumb: "",
		},
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			slots: {
				root: "group/switch flex items-center justify-start gap-3 disabled:text-fg-disabled has-data-[slot=description]:items-start",
				indicator: [
					"inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutral transition-colors group-disabled:cursor-not-allowed group-disabled:border group-disabled:border-border-disabled group-disabled:bg-transparent group-selected:bg-border-focus group-selected:group-disabled:border-none group-selected:group-disabled:bg-disabled",
				],
				thumb:
					"pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200 group-disabled:bg-fg-disabled",
			},
			variants: {
				variant: {
					default: {
						indicator: "focus-reset group-focus-visible/switch:focus-ring",
					},
				},
				size: {
					sm: {
						indicator: "h-5 w-9",
						thumb:
							"size-4 group-selected/switch:group-pressed/switch:ml-3 group-selected/switch:ml-4 group-pressed/switch:w-5",
					},
					md: {
						indicator: "h-6 w-11",
						thumb:
							"size-5 group-selected/switch:group-pressed/switch:ml-4 group-selected/switch:ml-5 group-pressed/switch:w-6",
					},
					lg: {
						indicator: "h-7 w-13",
						thumb:
							"size-6 group-selected/switch:group-pressed/switch:ml-5 group-selected/switch:ml-6 group-pressed/switch:w-7",
					},
				},
			},
			defaultVariants: {
				variant: "default",
				size: "md",
			},
		},
	},
});

export type SwitchStyles = typeof styles;

export { useStyles };
