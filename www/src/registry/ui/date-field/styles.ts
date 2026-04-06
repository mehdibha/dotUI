import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import dateFieldMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: [fieldStyles().field({ orientation: "vertical" })],
});

export type DateFieldStyles = typeof defaultStyles;

export const { useStyles } = createStyles(dateFieldMeta, {
	default: defaultStyles,
});
