import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import selectMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		selectValue: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: [fieldStyles().field(), "[&.flex-1]:*:data-button:w-full [&.w-full]:*:data-button:w-full"],
		selectValue: "flex-1 truncate text-left placeholder-shown:text-fg-muted",
	},
});

export type SelectStyles = typeof defaultStyles;

export const { useStyles } = createStyles(selectMeta, {
	default: defaultStyles,
});
