import { createStyles } from "@/modules/core/styles";

import disclosureMeta from "./meta";

const { useStyles, styles } = createStyles(disclosureMeta, {
	base: {
		slots: {
			root: "group/disclosure w-full disabled:text-fg-disabled **:data-button:[&[slot=trigger]]:w-full **:data-button:[&[slot=trigger]]:justify-between **:data-button:[&[slot=trigger]]:text-left disabled:**:[svg]:text-fg-disabled",
			heading: "flex",
			button: [
				"focus-reset focus-visible:focus-ring",
				"flex flex-1 cursor-interactive items-start justify-between gap-4 rounded-md py-3 text-left font-medium text-sm transition-shadow disabled:pointer-events-none",
			],
			panel:
				"h-(--disclosure-panel-height) overflow-clip text-fg-muted text-sm opacity-0 duration-300 ease-fluid-out group-expanded/disclosure:opacity-100 motion-safe:transition-[height,opacity]",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type DisclosureStyles = typeof styles;

export { useStyles };
