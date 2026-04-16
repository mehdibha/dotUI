import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import fieldMeta from "./meta";

const baseStyles = tv({
	slots: {
		fieldset: "",
		legend: "",
		fieldGroup:
			"cn-field-group group/field-group @container/field-group flex w-full flex-col has-[[data-checkbox]_[data-label]]:gap-2 has-data-checkbox:gap-3",
		field: "",
		fieldContent: "cn-field flex flex-col gap-1",
		label: "",
		description: "",
		fieldError: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		fieldset: ["flex flex-col gap-6", "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3"],
		legend: ["mb-3 font-medium text-base"],
		fieldGroup: "",
		// fieldGroup: "group/field-group @container/field-group flex w-full flex-col gap-7 has-data-[slot=checkbox]:gap-1.5 has-data-[slot=radio]:gap-1.5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
		field: "flex gap-2 invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden",
		fieldContent: "",
		label: [
			"inline-flex select-none items-center gap-px text-fg text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3",
			// Required state
			"in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
			// Disabled state
			"in-disabled:cursor-not-allowed in-disabled:text-fg-disabled",
			// Invalid state
			"in-data-invalid:text-fg-danger",
		],
		description: ["text-fg-muted text-xs", "in-data-disabled:text-fg-disabled"],
		fieldError: "text-fg-danger text-xs",
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
});

export type FieldStyles = typeof defaultStyles;

export { defaultStyles as fieldStyles };

export const { useStyles } = createStyles(fieldMeta, {
	default: defaultStyles,
});
