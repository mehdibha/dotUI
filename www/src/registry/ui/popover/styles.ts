import { createStyles } from "@/modules/core/styles";

import popoverMeta from "./meta";

const { useStyles, styles } = createStyles(popoverMeta, {
	base: {
		slots: {
			popover: "",
			arrow: "",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	styles: {
		default: {
			slots: {
				popover: [
					"popover z-50 min-w-(--trigger-width) max-w-72 origin-(--trigger-anchor-point) overflow-y-auto rounded-(--popover-radius) border bg-popover shadow-md forced-color-adjust-none",

					"transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:calc(var(--spacing)*0.5)]",

					"entering:transform-(--origin) entering:scale-95 entering:opacity-0",
					"exiting:transform-(--origin) exiting:scale-95 exiting:opacity-0 exiting:duration-150",
					"placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))] placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))]",
				],
				arrow: [
					"block [&>svg]:size-2.5 [&>svg]:fill-popover",
					"placement-bottom:[&>svg]:rotate-180 placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90",
				],
			},
		},
	},
});

export type PopoverStyles = typeof styles;

export { useStyles };
