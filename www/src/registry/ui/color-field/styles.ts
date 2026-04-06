import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import colorFieldMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: [fieldStyles().field({ orientation: "vertical" })],
});

export type ColorFieldStyles = typeof defaultStyles;

export const { useStyles } = createStyles(colorFieldMeta, {
	default: defaultStyles,
});
