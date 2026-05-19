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
				"top-1/2 left-1/2 grid h-(--slider-thumb-height) w-(--slider-thumb-width) cursor-(--slider-cursor) place-items-center rounded-(--slider-thumb-radius) shadow-(--slider-thumb-shadow) focus-reset transition-shadow [--slider-thumb-height:var(--slider-thumb-size)] [--slider-thumb-shadow:var(--slider-thumb-shadow-none)] [--slider-thumb-width:var(--slider-thumb-size)] focus-visible:focus-ring disabled:cursor-disabled dragging:cursor-(--slider-dragging-cursor)",
			],
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
					thumb: "[--slider-thumb-track-gap-shadow:var(--slider-thumb-track-gap-shadow-y)]",
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
					thumb: "border border-fg bg-bg",
				},
			},
			solid: {
				slots: {
					thumb: "border-0 bg-fg",
				},
			},
			outline: {
				slots: {
					thumb: "border border-border-control bg-bg",
				},
			},
			subtle: {
				slots: {
					thumb: "border border-border/70 bg-bg [--slider-thumb-shadow:var(--slider-thumb-shadow-sm)]",
				},
			},
			ring: {
				slots: {
					thumb: "border-2 border-fg bg-bg",
				},
			},
			bar: {
				slots: {
					thumb: "border-0 bg-fg [--slider-thumb-width:calc(var(--slider-thumb-size)*0.2)]",
				},
			},
			"dots-vertical": {
				slots: {
					thumb: [
						"flex flex-col items-center justify-center gap-0.5 border border-border bg-bg text-fg-muted [--slider-thumb-shadow:var(--slider-thumb-shadow-sm)] [--slider-thumb-width:calc(var(--slider-thumb-size)*0.6)]",
						"before:size-0.5 before:rounded-full before:bg-current before:content-['']",
						"after:size-0.5 after:rounded-full after:bg-current after:content-['']",
					],
				},
			},
			"dots-horizontal": {
				slots: {
					thumb: [
						"flex items-center justify-center border border-border bg-bg text-fg-muted [--slider-thumb-height:calc(var(--slider-thumb-size)*0.8)] [--slider-thumb-shadow:var(--slider-thumb-shadow-sm)] [--slider-thumb-width:calc(var(--slider-thumb-size)*1.6)]",
						"before:size-1 before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
					],
				},
			},
			arrows: {
				slots: {
					thumb: [
						"flex items-center justify-center gap-1 border border-border bg-bg text-[0.625rem] font-medium text-fg [--slider-thumb-height:calc(var(--slider-thumb-size)*0.8)] [--slider-thumb-shadow:var(--slider-thumb-shadow-sm)] [--slider-thumb-width:calc(var(--slider-thumb-size)*1.4)]",
						"before:content-['‹'] after:content-['›']",
					],
				},
			},
			target: {
				slots: {
					thumb: "border-4 border-fg bg-bg",
				},
			},
			raised: {
				slots: {
					thumb: [
						"border border-border-control bg-bg [--slider-thumb-shadow:var(--slider-thumb-shadow-lg)]",
						"hover:ring-4 hover:ring-fg/10 dragging:ring-0",
					],
				},
			},
			ticks: {
				slots: {
					thumb: [
						"flex items-center justify-center border border-border bg-bg text-fg-muted [--slider-thumb-shadow:var(--slider-thumb-shadow-sm)] [--slider-thumb-width:calc(var(--slider-thumb-size)*1.2)]",
						"before:h-3 before:w-px before:rounded-full before:bg-current before:shadow-[4px_0_0_currentColor,-4px_0_0_currentColor] before:content-['']",
					],
				},
			},
			faceted: {
				slots: {
					thumb: [
						"border border-border/60 [--slider-thumb-shadow:var(--slider-thumb-shadow-sm)]",
						"bg-[conic-gradient(from_45deg,var(--color-bg),var(--color-neutral),var(--color-fg),var(--color-bg),var(--color-fg-muted),var(--color-bg))]",
					],
				},
			},
		},
	},
});

export type SliderStyles = typeof styles;

export { useStyles };
