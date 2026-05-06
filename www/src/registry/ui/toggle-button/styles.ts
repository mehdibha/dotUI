import { createStyles } from "@/modules/core/styles";

import toggleButtonMeta from "./meta";

const { useStyles, styles } = createStyles(toggleButtonMeta, {
	base: {
		base: [
			"group/toggle-button relative inline-flex shrink-0 cursor-interactive select-none items-center justify-center whitespace-nowrap rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) transition-[background-color,border-color,color,box-shadow]",
			"focus-reset focus-visible:focus-ring",
			"**:[svg]:pointer-events-none **:[svg]:shrink-0",
			"selected:border-border-active selected:bg-selected selected:pressed:bg-selected-active selected:text-fg-on-selected selected:hover:bg-selected-hover",
			"disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled disabled:text-fg-disabled",
		],
		variants: {
			variant: {
				default:
					"border pressed:border-border-active selected:not-data-disabled:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
				primary: "bg-primary pressed:bg-primary-active text-fg-on-primary hover:bg-primary-hover disabled:border-0",
				quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
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

export type ToggleButtonStyles = typeof styles;

export { styles as toggleButtonStyles, useStyles };
