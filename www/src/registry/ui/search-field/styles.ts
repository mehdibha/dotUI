import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field";

import searchFieldMeta from "./meta";

const { useStyles, styles } = createStyles(searchFieldMeta, {
	base: {
		base: "",
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			base: ["[&.flex-1]:*:data-[slot=input]:w-full [&.w-full]:*:data-[slot=input]:w-full", fieldStyles().field()],
		},
	},
});

export type SearchFieldStyles = typeof styles;

export { useStyles };
