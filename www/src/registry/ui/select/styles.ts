import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import selectMeta from "./meta";

const { useStyles, styles } = createStyles(selectMeta, {
	base: {
		slots: {
			root: [
				fieldStyles().field(),
				"[&.flex-1]:*:data-button:w-full [&.w-full]:*:data-button:w-full",
			],
			selectValue: "flex-1 truncate text-left placeholder-shown:text-fg-muted",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type SelectStyles = typeof styles;

export { useStyles };
