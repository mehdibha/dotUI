import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import textFieldMeta from "./meta";

const { useStyles, styles } = createStyles(textFieldMeta, {
	base: {
		base: "",
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			base: [
				"w-full",
				fieldStyles().field({ orientation: "vertical" }),
			],
		},
	},
});

export type TextFieldStyles = typeof styles;

export { useStyles };
