import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import textFieldMeta from "./meta";

const { useStyles, styles } = createStyles(textFieldMeta, {
	base: {
		base: [
			"w-full",
			fieldStyles().field({ orientation: "vertical" }),
		],
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type TextFieldStyles = typeof styles;

export { useStyles };
