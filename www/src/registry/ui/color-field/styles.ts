import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import colorFieldMeta from "./meta";

const { useStyles, styles } = createStyles(colorFieldMeta, {
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

export type ColorFieldStyles = typeof styles;

export { useStyles };
