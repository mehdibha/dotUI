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
	styles: {
		default: {
			slots: {
				group: "flex flex-col items-start gap-2",
				list: "flex w-full flex-wrap gap-1",
				tag: [
					"focus-reset focus-visible:focus-ring",
					"focus-reset focus-visible:focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium text-sm leading-normal ring-offset-background transition-colors disabled:cursor-default disabled:bg-disabled disabled:text-fg-disabled",
				],
			},
		},
	},
});

export type TagGroupStyles = typeof styles;
export { useStyles };
