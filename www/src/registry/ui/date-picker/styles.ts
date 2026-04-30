import { createStyles } from "@/modules/core/styles";

import datePickerMeta from "./meta";

const { useStyles, styles } = createStyles(datePickerMeta, {
	base: {
		base: "flex flex-col items-start gap-2",
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type DatePickerStyles = typeof styles;

export { useStyles };
