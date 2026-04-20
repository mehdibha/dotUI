import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const baseStyles = tv({
	slots: {
		inputGroup:
			"group/input-group cn-input-group relative flex w-full min-w-0 items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
		inputGroupAddon: "cn-input-group-addon flex shrink-0 cursor-text select-none items-center justify-center",
		input: "cn-input w-full min-w-0 rounded-(--input-radius) transition-[color,box-shadow,border-color]",
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
			xs: {
				inputGroup: "cn-input-group-size-xs",
				input: "cn-input-size-xs",
				textArea: "cn-text-area-size-xs",
				dateInput: "cn-date-input-size-xs",
			},
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
		inputGroup: [
			"cursor-text border border-border-field bg-neutral text-fg shadow-xs",
			// focus
			"focus-reset focus-within:focus-input",
			// disabled (any descendant input disabled)
			"has-[[data-input][data-disabled],[data-text-area][data-disabled],[data-date-input][data-disabled]]:cursor-default",
			"has-[[data-input][data-disabled],[data-text-area][data-disabled],[data-date-input][data-disabled]]:border-border-disabled",
			"has-[[data-input][data-disabled],[data-text-area][data-disabled],[data-date-input][data-disabled]]:bg-disabled",
			"has-[[data-input][data-disabled],[data-text-area][data-disabled],[data-date-input][data-disabled]]:text-fg-disabled",
			// invalid
			"has-[[data-input][data-invalid],[data-text-area][data-invalid],[data-date-input][data-invalid]]:border-border-danger",
			"focus-within:has-[[data-input][data-invalid],[data-text-area][data-invalid],[data-date-input][data-invalid]]:border-border",
		],
		inputGroupAddon: "text-fg-muted [&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-4",
		input: [
			"border border-border-field bg-neutral text-fg shadow-xs outline-none",
			"focus-reset focus:focus-input",
			"placeholder:text-fg-muted",
			"disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled disabled:placeholder:text-fg-disabled",
			"invalid:border-border-danger focus:invalid:border-border",
		],
		textArea: [
			"flex min-h-16 resize-none border border-border-field bg-neutral text-fg shadow-xs outline-none",
			"focus-reset focus:focus-input",
			"placeholder:text-fg-muted",
			"disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled disabled:placeholder:text-fg-disabled",
			"invalid:border-border-danger focus:invalid:border-border",
		],
		dateInput: [
			"border border-border-field bg-neutral text-fg shadow-xs",
			"focus-reset focus-within:focus-input",
			"data-[disabled]:cursor-default data-[disabled]:border-border-disabled data-[disabled]:bg-disabled data-[disabled]:text-fg-disabled",
			"data-[invalid]:border-border-danger focus-within:data-[invalid]:border-border",
		],
		dateInputSegment: [
			"select-none rounded-xs px-0.5 type-literal:px-0 outline-hidden",
			"placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted",
			"focus:bg-accent focus:text-fg-on-accent focus:caret-transparent",
			"disabled:text-fg-disabled",
		],
	},
});

export type InputStyles = typeof defaultStyles;

export const { useStyles } = createStyles(inputMeta, {
	default: defaultStyles,
});
