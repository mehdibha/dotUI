import { createStyles } from "@/modules/core/styles";

import datePickerMeta from "./meta";

const { useStyles, styles } = createStyles(datePickerMeta, {
	base: {
		base: "",
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			base: "flex flex-col items-start gap-2",
		},
	},
});

export type DatePickerStyles = typeof styles;

export { useStyles };
