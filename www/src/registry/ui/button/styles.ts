import { createStyles } from "@/modules/core/styles";

import buttonMeta from "./meta";

const { useStyles, styles } = createStyles(buttonMeta, {
	base: {
		base: [
			"group/button relative inline-flex shrink-0 cursor-interactive select-none items-center justify-center whitespace-nowrap rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) transition-[background-color,border-color,color,box-shadow]",
			"focus-reset focus-visible:focus-ring",
			"**:[svg]:pointer-events-none **:[svg]:shrink-0",
			"pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
			"disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
		],
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
			size: {
				xs: "",
				sm: "",
				md: "",
				lg: "",
			},
			isIconOnly: {
				true: "p-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
	density: {
		compact: {
			base: "gap-1 text-xs/relaxed",
			variants: {
				size: {
					xs: "h-5 rounded-sm px-2 text-[0.625rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5",
					sm: "h-6 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
					md: "h-7 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
					lg: "h-8 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4",
				},
			},
		},
		default: {
			base: "text-sm *:[svg]:not-with-[size]:size-4",
			variants: {
				size: {
					xs: "h-6 gap-1 px-2 text-xs has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
					sm: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7",
					md: "h-8 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5",
					lg: "h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4",
				},
			},
		},
		comfortable: {
			base: "text-sm *:[svg]:not-with-[size]:size-4",
			variants: {
				size: {
					xs: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
					sm: "h-8 gap-1 px-2.5 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-8",
					md: "h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9",
					lg: "h-10 gap-1.5 px-3 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-10",
				},
			},
		},
	},
});

export type ButtonStyles = typeof styles;

export { styles as buttonStyles, useStyles };
