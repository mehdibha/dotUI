import { createStyles } from "@/modules/core/styles";

import fieldMeta from "./meta";

const { useStyles, styles } = createStyles(fieldMeta, {
	base: {
		slots: {
			fieldset: "",
			legend: "",
			fieldGroup: "group/field-group @container/field-group flex w-full flex-col",
			field: "",
			fieldContent: "flex flex-col gap-1",
			label: "",
			description: "nth-last-2:-mt-1 in-data-disabled:text-fg-disabled text-fg-muted last:mt-0",
			fieldError: "text-fg-danger",
		},
	},
	density: {
		compact: {
			slots: {
				label: "text-xs",
				description: "text-xs",
				fieldError: "text-xs",
				fieldGroup: "gap-4 has-data-checkbox:gap-2 has-[[data-checkbox]_[data-label]]:gap-1.5",
			},
		},
		default: {
			slots: {
				label: "text-sm",
				description: "text-sm",
				fieldError: "text-sm",
				fieldGroup: "gap-5 has-data-checkbox:gap-3 has-[[data-checkbox]_[data-label]]:gap-2",
			},
		},
		comfortable: {
			slots: {
				label: "text-sm",
				description: "text-sm",
				fieldError: "text-sm",
				fieldGroup: "gap-7 has-data-checkbox:gap-3 has-[[data-checkbox]_[data-label]]:gap-2.5",
			},
		},
	},
	styles: {
		default: {
			slots: {
				field: "flex gap-2 invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden",
				label: [
					"inline-flex select-none items-center gap-px leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3",
					// Required state
					"in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
					// Disabled state
					"in-disabled:cursor-not-allowed in-disabled:text-fg-disabled",
					// Invalid state
					"in-data-invalid:text-fg-danger",
				],
			},
			variants: {
				orientation: {
					horizontal: {
						field: "flex-row items-center gap-2 has-data-[slot=description]:items-start",
					},
					vertical: {
						field: "flex-col gap-2",
					},
				},
			},
			defaultVariants: {
				orientation: "vertical",
			},
		},
	},
});

export type FieldStyles = typeof styles;

export { styles as fieldStyles, useStyles };
