import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import dateFieldMeta from "./meta";

const { useStyles, styles } = createStyles(dateFieldMeta, {
	base: {
		base: "",
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			base: [fieldStyles().field({ orientation: "vertical" })],
		},
	},
});

export type DateFieldStyles = typeof styles;

export { useStyles };
