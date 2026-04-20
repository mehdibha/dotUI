import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const baseStyles = tv({
	slots: {
		inputGroup:
			"group/input-group cn-input-group relative flex w-full min-w-0 items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
		inputGroupAddon: "cn-input-group-addon flex shrink-0 cursor-text select-none items-center justify-center",
		input:
			"cn-input w-full min-w-0 rounded-(--input-radius) in-data-input-group:px-0 transition-[color,box-shadow,border-color]",
		textArea: "cn-text-area w-full min-w-0 rounded-(--input-radius) transition-[color,box-shadow,border-color]",
		dateInput:
			"cn-date-input inline-flex w-full min-w-0 cursor-text items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
		dateInputSegment: "cn-date-input-segment",
	},
	variants: {
		orientation: {
			horizontal: {
				inputGroup: "flex-row",
			},
			vertical: {
				inputGroup: "flex-col items-stretch",
			},
		},
		size: {
			sm: {
				inputGroup: "cn-input-group-size-sm",
				input: "cn-input-size-sm",
				textArea: "cn-text-area-size-sm",
				dateInput: "cn-date-input-size-sm",
			},
			md: {
				inputGroup: "cn-input-group-size-md",
				input: "cn-input-size-md",
				textArea: "cn-text-area-size-md",
				dateInput: "cn-date-input-size-md",
			},
			lg: {
				inputGroup: "cn-input-group-size-lg",
				input: "cn-input-size-lg",
				textArea: "cn-text-area-size-lg",
				dateInput: "cn-date-input-size-lg",
			},
		},
	},
	defaultVariants: {
		size: "md",
		orientation: "horizontal",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		inputGroup: "focus-reset border border-border-field bg-neutral",
		inputGroupAddon: "",
		input:
			"focus-reset not-in-data-input-group:focus:focus-input not-in-data-input-group:border border-border-field not-in-data-input-group:bg-neutral",
		textArea: "",
		dateInput: "",
		dateInputSegment: "",
	},
});

export type InputStyles = typeof defaultStyles;

export const { useStyles } = createStyles(inputMeta, {
	default: defaultStyles,
});
