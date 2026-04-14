import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import timeFieldMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: [
		"[.flex-1]:*:data-date-input:w-full [.w-full]:*:data-date-input:w-full [.w-full]:*:data-input-group:w-full",
		fieldStyles().field({ orientation: "vertical" }),
	],
});

export type TimeFieldStyles = typeof defaultStyles;

export const { useStyles } = createStyles(timeFieldMeta, {
	default: defaultStyles,
});
