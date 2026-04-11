import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import buttonMeta from "./meta";

const baseStyles = tv({
	base: [
		"relative box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow]",
		"*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
		// svg
		"[&_svg]:pointer-events-none [&_svg]:not-with-[size]:size-4 [&_svg]:shrink-0",
		// focus state
		"focus-reset focus-visible:focus-ring",
		// disabled state
		"disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
		// pending state
		"pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
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
			xs: "h-7 px-2.5 has-[>svg]:px-2 [&_svg]:not-with-[size]:size-3",
			sm: "h-8 px-3 has-[>svg]:px-2.5",
			md: "h-9 px-4 has-[>svg]:px-3",
			lg: "h-10 px-5 has-[>svg]:px-4",
			"icon-xs": "h-7 w-7 px-0 [&_svg]:not-with-[size]:size-3",
			"icon-sm": "h-8 w-8 px-0",
			icon: "h-9 w-9 px-0",
			"icon-lg": "h-10 w-10 px-0",
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
