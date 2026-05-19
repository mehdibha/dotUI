import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import sliderMeta from "./meta";

const { useStyles, styles } = createStyles(sliderMeta, {
	base: {
		slots: {
			root: fieldStyles().field(),
			control:
				"relative flex grow cursor-(--slider-cursor) touch-none items-center select-none disabled:cursor-disabled",
			track:
				"pointer-events-none relative grow overflow-hidden rounded-(--slider-track-radius) bg-neutral disabled:bg-disabled",
			fill: "pointer-events-none bg-(--slider-fill-color) disabled:bg-disabled",
			thumb:
				"top-1/2 left-1/2 grid cursor-(--slider-cursor) place-items-center rounded-(--slider-thumb-radius) focus-reset disabled:cursor-disabled dragging:cursor-(--slider-dragging-cursor)",
			output: "text-fg-muted disabled:text-fg-disabled",
		},
		variants: {
			orientation: {
				horizontal: {
					control: "-my-2 w-full py-2",
					track: "h-(--slider-size) w-full",
				},
				vertical: {
					root: "items-center",
					control: "-mx-2 h-48 flex-col px-2",
					track: "h-full w-(--slider-size)",
				},
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	},
	density: {
		compact: {
			slots: {
				output: "text-xs",
			},
		},
		default: {
			slots: {
				output: "text-sm",
			},
		},
		comfortable: {
			slots: {
				output: "text-sm",
			},
		},
	},
	params: {
		/* ----------------------------- Thumb styles ----------------------------- */
		"thumb-style": {
			square: {
				slots: {
					thumb: "size-4 border border-fg bg-bg shadow-none",
				},
			},
			solid: {
				slots: {
					thumb: "size-4 border-0 bg-fg shadow-none",
				},
			},
			outline: {
				slots: {
					thumb: "size-4 border border-border-control bg-bg shadow-none",
				},
			},
			subtle: {
				slots: {
					thumb: "size-4 border border-border/70 bg-bg shadow-sm shadow-fg/10",
				},
			},
			ring: {
				slots: {
					thumb: "size-4 border-2 border-fg bg-bg shadow-none",
				},
			},
			bar: {
				slots: {
					thumb: "h-5 w-1 border-0 bg-fg shadow-none",
				},
			},
			"dots-vertical": {
				slots: {
					thumb: [
						"flex h-5 w-3 flex-col items-center justify-center gap-0.5 border border-border bg-bg text-fg-muted shadow-sm",
						"before:size-0.5 before:rounded-full before:bg-current before:content-['']",
						"after:size-0.5 after:rounded-full after:bg-current after:content-['']",
					],
				},
			},
			"dots-horizontal": {
				slots: {
					thumb: [
						"flex h-4 w-8 items-center justify-center border border-border bg-bg text-fg-muted shadow-sm",
						"before:size-1 before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
					],
				},
			},
			arrows: {
				slots: {
					thumb: [
						"flex h-4 w-7 items-center justify-center gap-1 border border-border bg-bg text-[0.625rem] font-medium text-fg shadow-sm",
						"before:content-['‹'] after:content-['›']",
					],
				},
			},
			target: {
				slots: {
					thumb: "size-4 border-4 border-fg bg-bg shadow-none",
				},
			},
			raised: {
				slots: {
					thumb: [
						"size-5 border border-border-control bg-bg shadow-lg shadow-fg/10",
						"hover:ring-4 hover:ring-fg/10 dragging:ring-0",
					],
				},
			},
			ticks: {
				slots: {
					thumb: [
						"flex h-5 w-6 items-center justify-center border border-border bg-bg text-fg-muted shadow-sm",
						"before:h-3 before:w-px before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
					],
				},
			},
			faceted: {
				slots: {
					thumb: [
						"size-4 border border-border/60 shadow-sm",
						"bg-[conic-gradient(from_45deg,var(--color-bg),var(--color-neutral),var(--color-fg),var(--color-bg),var(--color-fg-muted),var(--color-bg))]",
					],
				},
			},
		},
	},
});

export type SliderStyles = typeof styles;

export { useStyles };
