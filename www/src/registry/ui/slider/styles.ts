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
			thumb: [
				"top-1/2 left-1/2 grid cursor-(--slider-cursor) place-items-center rounded-(--slider-thumb-radius) focus-reset transition-shadow focus-visible:focus-ring disabled:cursor-disabled dragging:cursor-(--slider-dragging-cursor)",
			],
			output: "text-fg-muted disabled:text-fg-disabled",
		},
		variants: {
			orientation: {
				horizontal: {
					control: "-my-2 w-full py-2",
					track: "h-(--slider-size) w-full",
					thumb: "shadow-[var(--slider-thumb-shadow),calc(var(--slider-thumb-track-gap)*-1)_0_0_0_var(--color-bg),var(--slider-thumb-track-gap)_0_0_0_var(--color-bg)]",
				},
				vertical: {
					root: "items-center",
					control: "-mx-2 h-48 flex-col px-2",
					track: "h-full w-(--slider-size)",
					thumb: "shadow-[var(--slider-thumb-elevation-shadow),0_calc(var(--slider-thumb-track-gap)*-1)_0_0_var(--color-bg),0_var(--slider-thumb-track-gap)_0_0_var(--color-bg)]",
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
			solid: {
				slots: {
					thumb: "size-(--slider-thumb-size) border-0 bg-fg",
				},
			},
			outline: {
				slots: {
					thumb: "size-(--slider-thumb-size) border-2 border-border-control bg-bg",
				},
			},
			bar: {
				slots: {
					thumb: "h-(--slider-thumb-size) w-[calc(var(--slider-thumb-size)*0.2)] border-0 bg-fg",
				},
			},
			"dots-vertical": {
				slots: {
					thumb: [
						"flex h-(--slider-thumb-size) w-[calc(var(--slider-thumb-size)*0.6)] flex-col items-center justify-center gap-0.5 border border-border bg-bg text-fg-muted",
						"before:size-0.5 before:rounded-full before:bg-current before:content-['']",
						"after:size-0.5 after:rounded-full after:bg-current after:content-['']",
					],
				},
			},
			"dots-horizontal": {
				slots: {
					thumb: [
						"flex h-[calc(var(--slider-thumb-size)*0.8)] w-[calc(var(--slider-thumb-size)*1.6)] items-center justify-center border border-border bg-bg text-fg-muted",
						"before:size-1 before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
					],
				},
			},
			arrows: {
				slots: {
					thumb: [
						"flex h-[calc(var(--slider-thumb-size)*0.8)] w-[calc(var(--slider-thumb-size)*1.4)] items-center justify-center gap-1 border border-border bg-bg text-[0.625rem] font-medium text-fg",
						"before:content-['‹'] after:content-['›']",
					],
				},
			},
			ticks: {
				slots: {
					thumb: [
						"flex h-(--slider-thumb-size) w-[calc(var(--slider-thumb-size)*1.2)] items-center justify-center border border-border bg-bg text-fg-muted",
						"before:h-3 before:w-px before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
					],
				},
			},
			faceted: {
				slots: {
					thumb: [
						"size-(--slider-thumb-size) border border-border/60",
						"bg-[conic-gradient(from_45deg,var(--color-bg),var(--color-neutral),var(--color-fg),var(--color-bg),var(--color-fg-muted),var(--color-bg))]",
					],
				},
			},
		},
	},
});

export type SliderStyles = typeof styles;

export { useStyles };
