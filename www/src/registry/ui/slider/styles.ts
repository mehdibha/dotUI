import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import sliderMeta from "./meta";

const { useStyles, styles } = createStyles(sliderMeta, {
	base: {
		slots: {
			root: fieldStyles().field(),
			track: [
				"relative w-full grow cursor-interactive overflow-visible rounded-(--slider-track-radius) bg-neutral [--slider-fill-size:0%] [--slider-fill-start:0%] disabled:cursor-disabled",
			],
			fill: "pointer-events-none absolute bg-primary disabled:bg-disabled",
			thumb: [
				"relative isolate grid place-items-center border border-transparent bg-bg text-fg",
				"top-[50%] left-[50%]",
				"disabled:cursor-disabled",
			],
			output: "text-fg-muted disabled:text-fg-disabled",
		},
		variants: {
			orientation: {
				horizontal: {
					track: "h-5",
					fill: "left-(--slider-fill-start) h-full w-(--slider-fill-size)",
				},
				vertical: {
					root: "items-center",
					track: "h-48 w-5",
					fill: "bottom-(--slider-fill-start) h-(--slider-fill-size) w-full",
				},
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	params: {
		/* ----------------------------- Track styles ----------------------------- */
		"track-style": {
			line: {
				slots: {},
				variants: {
					orientation: {
						horizontal: {
							track: "h-1",
						},
						vertical: {
							track: "w-1",
						},
					},
				},
			},
			filled: {
				slots: {},
				variants: {
					orientation: {
						horizontal: {
							track: "h-5",
						},
						vertical: {
							track: "h-48 w-5",
						},
					},
				},
			},
		},
		/* ----------------------------- Thumb styles ----------------------------- */
		// "thumb-style": {
		// 	square: {
		// 		slots: {
		// 			thumb: "size-4 rounded-[1px] border border-fg bg-bg shadow-none",
		// 		},
		// 	},
		// 	solid: {
		// 		slots: {
		// 			thumb: "size-4 rounded-full border-0 bg-fg shadow-none",
		// 		},
		// 	},
		// 	outline: {
		// 		slots: {
		// 			thumb: "size-4 rounded-full border border-border-control bg-bg shadow-none",
		// 		},
		// 	},
		// 	subtle: {
		// 		slots: {
		// 			thumb: "size-4 rounded-full border border-border/70 bg-bg shadow-sm shadow-fg/10",
		// 		},
		// 	},
		// 	ring: {
		// 		slots: {
		// 			thumb: "size-4 rounded-full border-2 border-fg bg-bg shadow-none",
		// 		},
		// 	},
		// 	bar: {
		// 		slots: {
		// 			thumb: "h-5 w-1 rounded-full border-0 bg-fg shadow-none",
		// 		},
		// 	},
		// 	"dots-vertical": {
		// 		slots: {
		// 			thumb: [
		// 				"flex h-5 w-3 flex-col items-center justify-center gap-0.5 rounded-sm border border-border bg-bg text-fg-muted shadow-sm",
		// 				"before:size-0.5 before:rounded-full before:bg-current before:content-['']",
		// 				"after:size-0.5 after:rounded-full after:bg-current after:content-['']",
		// 			],
		// 		},
		// 	},
		// 	"dots-horizontal": {
		// 		slots: {
		// 			thumb: [
		// 				"flex h-4 w-8 items-center justify-center rounded-full border border-border bg-bg text-fg-muted shadow-sm",
		// 				"before:size-1 before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
		// 			],
		// 		},
		// 	},
		// 	arrows: {
		// 		slots: {
		// 			thumb: [
		// 				"flex h-4 w-7 items-center justify-center gap-1 rounded-full border border-border bg-bg text-[0.625rem] font-medium text-fg shadow-sm",
		// 				"before:content-['‹'] after:content-['›']",
		// 			],
		// 		},
		// 	},
		// 	target: {
		// 		slots: {
		// 			thumb: "size-4 rounded-full border-4 border-fg bg-bg shadow-none",
		// 		},
		// 	},
		// 	raised: {
		// 		slots: {
		// 			thumb: [
		// 				"size-5 rounded-full border border-border-control bg-bg shadow-lg shadow-fg/10",
		// 				"hover:ring-4 hover:ring-fg/10 dragging:ring-0",
		// 			],
		// 		},
		// 	},
		// 	ticks: {
		// 		slots: {
		// 			thumb: [
		// 				"flex h-5 w-6 items-center justify-center rounded-sm border border-border bg-bg text-fg-muted shadow-sm",
		// 				"before:h-3 before:w-px before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
		// 			],
		// 		},
		// 	},
		// 	faceted: {
		// 		slots: {
		// 			thumb: [
		// 				"size-4 rounded-full border border-border/60 shadow-sm",
		// 				"bg-[conic-gradient(from_45deg,var(--color-bg),var(--color-neutral),var(--color-fg),var(--color-bg),var(--color-fg-muted),var(--color-bg))]",
		// 			],
		// 		},
		// 	},
		// },
	},
});

export type SliderStyles = typeof styles;

export { useStyles };
