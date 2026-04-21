import { createStyles } from "@/modules/core/styles";

import dialogMeta from "./meta";

const { useStyles, styles } = createStyles(dialogMeta, {
	base: {
		slots: {
			content: "",
			header: "",
			heading: "",
			description: "",
			body: "",
			footer: "",
			inset: "",
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
				content: "relative flex flex-col gap-4 in-data-popover:p-4 p-6 outline-none",
				header: "flex flex-col gap-2 text-left",
				heading: "font-semibold in-popover:font-medium in-popover:text-base text-lg leading-none",
				description: "text-fg-muted text-sm",
				body: "flex flex-1 flex-col gap-2",
				footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				inset: "-mx-6 in-popover:-mx-4 border bg-muted in-popover:px-4 px-6 py-4",
			},
		},
	},
});

export type DialogStyles = typeof styles;
export { useStyles };
