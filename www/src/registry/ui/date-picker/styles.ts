import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import datePickerMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: "flex flex-col items-start gap-2",
});

export type DatePickerStyles = typeof defaultStyles;

export const { useStyles } = createStyles(datePickerMeta, {
	default: defaultStyles,
});
