import { createStyles } from "@/modules/core/styles";

import tagGroupMeta from "./meta";

const { useStyles, styles } = createStyles(tagGroupMeta, {
	base: {
		slots: {
			group: "",
			list: "",
			tag: "",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	styles: {},
});

export type TagGroupStyles = typeof styles;

export { useStyles };
