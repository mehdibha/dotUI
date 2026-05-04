import { createStyles } from "@/modules/core/styles";

import dialogMeta from "./meta";

const { useStyles, styles } = createStyles(dialogMeta, {
	base: {
		slots: {
			content: "relative flex max-h-[inherit] flex-col gap-4 in-data-popover:p-4 p-6 outline-none has-data-command:p-0",
			header: "flex flex-col gap-2 text-left",
			heading: "font-semibold in-popover:font-medium in-popover:text-base text-lg leading-none",
			description: "text-fg-muted text-sm",
			body: "-mx-6 in-data-popover:-mx-4 flex flex-1 flex-col gap-2 overflow-y-auto in-data-popover:px-4 px-6",
			footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
			inset: "-mx-6 in-data-popover:-mx-4 border bg-muted in-data-popover:px-4 px-6 py-4",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type DialogStyles = typeof styles;

export { useStyles };
