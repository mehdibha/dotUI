import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import timeFieldMeta from "./meta";

const { useStyles, styles } = createStyles(timeFieldMeta, {
	base: {
		base: [
			"[.flex-1]:*:data-date-input:w-full [.w-full]:*:data-date-input:w-full [.w-full]:*:data-input-group:w-full",
			fieldStyles().field({ orientation: "vertical" }),
		],
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type TimeFieldStyles = typeof styles;

export { useStyles };
