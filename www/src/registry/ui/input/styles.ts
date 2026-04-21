import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup:
				"group/input-group cn-input-group relative flex w-full min-w-0 items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			inputGroupAddon:
				"cn-input-group-addon flex shrink-0 cursor-text select-none items-center justify-center",
			input:
				"cn-input w-full min-w-0 rounded-(--input-radius) in-data-input-group:px-0 transition-[color,box-shadow,border-color]",
			textArea:
				"cn-text-area w-full min-w-0 rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			dateInput:
				"cn-date-input inline-flex w-full min-w-0 cursor-text items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			dateInputSegment: "cn-date-input-segment",
		},
		variants: {
			orientation: {
				horizontal: { inputGroup: "flex-row" },
				vertical: { inputGroup: "flex-col items-stretch" },
			},
			size: { sm: {}, md: {}, lg: {} },
		},
		defaultVariants: { size: "md", orientation: "horizontal" },
	},
	density: {
		compact: {
			slots: { input: "text-sm md:text-xs/relaxed" },
			variants: {
				size: {
					sm: { inputGroup: "h-6 px-2", input: "h-6 px-2" },
					md: { inputGroup: "h-7 px-2", input: "h-7 px-2" },
					lg: { inputGroup: "h-8 px-2.5", input: "h-8 px-2.5" },
				},
			},
		},
		default: {
			slots: { input: "text-base md:text-sm" },
			variants: {
				size: {
					sm: { inputGroup: "h-7 px-2", input: "h-7 px-2" },
					md: { inputGroup: "h-8 px-2.5", input: "h-8 px-2.5" },
					lg: { inputGroup: "h-9 px-3", input: "h-9 px-3" },
				},
			},
		},
		comfortable: {
			slots: { input: "text-base md:text-sm" },
			variants: {
				size: {
					sm: { inputGroup: "h-8 px-2.5", input: "h-8 px-2.5" },
					md: { inputGroup: "h-9 px-3", input: "h-9 px-3" },
					lg: { inputGroup: "h-10 px-3", input: "h-10 px-3" },
				},
			},
		},
	},
	styles: {
		default: {
			slots: {
				inputGroup: "focus-reset border border-border-field bg-neutral",
				input:
					"focus-reset not-in-data-input-group:focus:focus-input not-in-data-input-group:border border-border-field not-in-data-input-group:bg-neutral",
			},
		},
	},
});

export type InputStyles = typeof styles;
export { useStyles };
