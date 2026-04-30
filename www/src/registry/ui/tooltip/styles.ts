import { createStyles } from "@/modules/core/styles";

import tooltipMeta from "./meta";

const { useStyles, styles } = createStyles(tooltipMeta, {
	base: {
		slots: {
			content: "",
			arrow: "",
			trigger: "",
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
				content: [
					"w-fit max-w-xs origin-(--trigger-anchor-point) rounded-sm bg-tooltip px-3 py-1.5 text-center text-fg-on-tooltip text-xs outline-none forced-color-adjust-none",
					"transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:--spacing(0.5)]",
					"entering:transform-(--origin) entering:scale-95 entering:opacity-0",
					"exiting:transform-(--origin) exiting:scale-95 exiting:opacity-0 exiting:duration-150",
					"placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))] placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))]",
				],
				arrow: [
					"block [&>svg]:size-2.5 [&>svg]:fill-tooltip",
					"placement-bottom:[&>svg]:rotate-180 placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90",
				],
				trigger: "focus-reset focus-visible:focus-ring",
			},
		},
	},
});

export type TooltipStyles = typeof styles;

export { useStyles };
