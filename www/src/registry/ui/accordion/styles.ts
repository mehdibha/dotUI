import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

const baseStyles = tv({
	base: "",
});

const defaultStyle = tv({
	extend: baseStyles,
	base: "**:data-disclosure:not-last:border-b",
});

const testStyle = tv({
	extend: baseStyles,
	base: "bg-red-500",
});

/* --- styles:accordion --- */
export const { useStyles } = createStyles("accordion", {
	default: defaultStyle,
	test: testStyle,
});
