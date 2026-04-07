import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import accordionMeta from "./meta";

const baseStyles = tv({
	base: "flex w-full flex-col",
});

const defaultStyles = tv({
	extend: baseStyles,
	base: "**:data-disclosure:not-last:border-b",
});

export const { useStyles } = createStyles(accordionMeta, {
	default: defaultStyles,
});
