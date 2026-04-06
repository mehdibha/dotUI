import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import textFieldMeta from "./meta";

const baseStyles = tv({
	base: "",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: [
		"[&.flex-1]:*:data-[slot=input]:w-full [&.w-full]:*:data-[slot=input]:w-full",
		fieldStyles().field({ orientation: "vertical" }),
	],
});

export type TextFieldStyles = typeof defaultStyles;

export const { useStyles } = createStyles(textFieldMeta, {
	default: defaultStyles,
});
