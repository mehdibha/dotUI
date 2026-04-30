import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import dateFieldMeta from "./meta";

const { useStyles, styles } = createStyles(dateFieldMeta, {
	base: {
		base: [
			fieldStyles().field({ orientation: "vertical" }),
		],
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type DateFieldStyles = typeof styles;

export { useStyles };
