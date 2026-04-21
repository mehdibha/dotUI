import { createStyles } from "@/modules/core/styles";

import toggleButtonGroupMeta from "./meta";

const { useStyles, styles } = createStyles(toggleButtonGroupMeta, {
	base: {
		slots: {
			root: "",
			item: "",
		},
	},
	density: { compact: {}, default: {}, comfortable: {} },
	styles: {
		default: {
			slots: {
				root: "flex w-fit items-center",
				item: [
					"selected:z-11 min-w-0 shrink-0 rounded-none shadow-none hover:z-10 focus:z-10 focus-visible:z-12 selected:focus-visible:z-12",
				],
			},
			variants: {
				orientation: {
					horizontal: {
						root: "flex-row has-data-[variant=default]:-space-x-px",
						item: "first:rounded-l-md last:rounded-r-md",
					},
					vertical: {
						root: "flex-col has-data-[variant=default]:-space-y-px",
						item: "first:rounded-t-md last:rounded-b-md",
					},
				},
			},
		},
	},
});

export type ToggleButtonGroupStyles = typeof styles;

export { useStyles };
