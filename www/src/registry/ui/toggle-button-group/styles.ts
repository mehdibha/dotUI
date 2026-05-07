import { createStyles } from "@/modules/core/styles";

import toggleButtonGroupMeta from "./meta";

const { useStyles, styles } = createStyles(toggleButtonGroupMeta, {
	base: {
		slots: {
			root: [
				"flex w-fit items-stretch",
				"*:data-button:min-w-0 *:data-button:shrink-0 *:data-button:shadow-none",
				"*:data-button:selected:z-10 *:data-button:focus-visible:z-20 *:data-button:selected:focus-visible:z-20 *:data-button:hover:z-10",
			],
		},
		variants: {
			orientation: {
				horizontal: {
					root: "flex-row has-data-[variant=default]:-space-x-px *:not-last:data-button:rounded-r-none *:not-first:data-button:rounded-l-none",
				},
				vertical: {
					root: "flex-col has-data-[variant=default]:-space-y-px *:not-first:data-button:rounded-t-none *:not-last:data-button:rounded-b-none",
				},
			},
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type ToggleButtonGroupStyles = typeof styles;

export { useStyles };
