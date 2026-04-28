import { createStyles } from "@/modules/core/styles";

import toggleButtonMeta from "./meta";

const { useStyles, styles } = createStyles(toggleButtonMeta, {
	base: {
		base: "",
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			base: [
				"inline-flex shrink-0 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow]",

				// focus state
				"focus-reset focus-visible:focus-ring",

				// selected state
				"selected:bg-selected selected:pressed:bg-selected-active not-selected:text-fg-muted selected:text-fg-on-selected selected:hover:bg-selected-hover",

				// disabled state
				"disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled disabled:text-fg-disabled",
			],
			variants: {
				variant: {
					default:
						"border pressed:border-border-active selected:not-data-disabled:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
					quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
				},
				size: {
					sm: "h-8 px-3 data-icon-only:w-8 data-icon-only:p-0 [&_svg]:size-4",
					md: "h-9 px-4 data-icon-only:w-9 data-icon-only:p-0 [&_svg]:size-4",
					lg: "h-10 px-5 data-icon-only:w-10 data-icon-only:p-0 [&_svg]:size-5",
				},
			},
		},
	},
});

export type ToggleButtonStyles = typeof styles;

export { styles as toggleButtonStyles, useStyles };
