import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import buttonMeta from "./meta";

const baseStyles = tv({
	base: [
		"cn-button-base group/button relative inline-flex shrink-0 cursor-interactive select-none items-center justify-center whitespace-nowrap rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) transition-[background-color,border-color,color,box-shadow]",
		// focus state
		"focus-reset focus-visible:focus-ring",
		// svg
		"**:[svg]:pointer-events-none **:[svg]:not-with-[size]:size-4 **:[svg]:shrink-0",
		// pending state
		"pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
		// disabled state
		"disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
	],
	variants: {
		variant: {
			default: "",
			primary: "",
			quiet: "",
			link: "",
			warning: "",
			danger: "",
		},
		size: {
			xs: "cn-button-size-xs",
			sm: "cn-button-size-sm",
			md: "cn-button-size-md",
			lg: "cn-button-size-lg",
			"icon-xs": "cn-button-size-icon-xs",
			"icon-sm": "cn-button-size-icon-sm",
			icon: "cn-button-size-icon",
			"icon-lg": "cn-button-size-icon-lg",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	base: "",
	variants: {
		variant: {
			default:
				"border pressed:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
			primary:
				"pending:border-0 bg-primary pressed:bg-primary-active text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0",
			quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
			link: "text-fg underline-offset-4 hover:underline",
			warning: "bg-warning pressed:bg-warning-active text-fg-on-warning hover:bg-warning-hover",
			danger: "bg-danger pressed:bg-danger-active text-fg-on-danger hover:bg-danger-hover",
		},
	},
});

export type ButtonStyles = typeof defaultStyles;

export { defaultStyles as buttonStyles };

export const { useStyles } = createStyles(buttonMeta, {
	default: defaultStyles,
});
