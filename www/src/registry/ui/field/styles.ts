import { createStyles } from "@/modules/core/styles";

import fieldMeta from "./meta";

const { useStyles, styles } = createStyles(fieldMeta, {
	base: {
		slots: {
			fieldset: "",
			legend: "",
			fieldGroup: "group/field-group @container/field-group flex w-full flex-col",
			field: "flex w-full gap-2 invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden",
			fieldContent: "flex flex-col gap-1",
			label: [
				"inline-flex select-none items-center gap-px leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3",
				"in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
				"in-disabled:cursor-not-allowed in-disabled:text-fg-disabled",
				"in-data-invalid:text-fg-danger",
			],
			description: "nth-last-2:-mt-1 in-data-disabled:text-fg-disabled text-fg-muted last:mt-0",
			fieldError: "text-fg-danger",
		},
		variants: {
			orientation: {
				horizontal: {
					field: "flex-row items-center gap-2 has-data-[slot=description]:items-start",
				},
				vertical: {
					field: "w-full flex-col gap-2",
				},
			},
		},
		defaultVariants: {
			orientation: "vertical",
		},
	},
	density: {
		compact: {
			slots: {
				label: "text-xs",
				description: "text-xs",
				fieldError: "text-xs",
				fieldGroup:
					"gap-4 has-[[data-checkbox]_[data-label]]:gap-1.5 has-[[data-radio]_[data-label]]:gap-1.5 has-data-checkbox:gap-2 has-data-radio:gap-2",
			},
		},
		default: {
			slots: {
				label: "text-sm",
				description: "text-sm",
				fieldError: "text-sm",
				fieldGroup:
					"gap-5 has-[[data-checkbox]_[data-label]]:gap-2 has-[[data-radio]_[data-label]]:gap-2 has-data-checkbox:gap-3 has-data-radio:gap-3",
			},
		},
		comfortable: {
			slots: {
				label: "text-sm",
				description: "text-sm",
				fieldError: "text-sm",
				fieldGroup:
					"gap-7 has-[[data-checkbox]_[data-label]]:gap-2.5 has-[[data-radio]_[data-label]]:gap-2.5 has-data-checkbox:gap-3 has-data-radio:gap-3",
			},
		},
	},
});

export type FieldStyles = typeof styles;

export { styles as fieldStyles, useStyles };
