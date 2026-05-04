import { createStyles } from "@/modules/core/styles";

import dialogMeta from "./meta";

const { useStyles, styles } = createStyles(dialogMeta, {
	base: {
		slots: {
			content:
				"relative flex max-h-[inherit] min-h-0 flex-col gap-4 outline-none has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto",
			header: "flex flex-col gap-2 text-left",
			title: "",
			description: "text-fg-muted",
			body: "flex min-h-0 flex-1 flex-col gap-2 [@container_(height<31.25rem)]:mx-0 [@container_(height<31.25rem)]:shrink-0 [@container_(height<31.25rem)]:overflow-y-visible [@container_(height<31.25rem)]:px-0",
			footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
			closeButton: "absolute",
		},
	},
	density: {
		compact: {
			slots: {
				content: "in-data-popover:p-2.5 p-4",
				title: "font-medium text-sm",
				description: "text-xs/relaxed",
				closeButton: "top-2 right-2",
				body: "-mx-4 in-data-popover:-mx-2.5 in-data-popover:px-2.5 px-4",
			},
		},
		default: {
			slots: {
				content: "in-data-popover:p-2.5 p-4",
				title: "font-medium text-base leading-none",
				description: "text-sm",
				closeButton: "top-2 right-2",
				body: "-mx-4 in-data-popover:-mx-2.5 in-data-popover:px-2.5 px-4",
			},
		},
		comfortable: {
			slots: {
				content: "in-data-popover:p-2.5 p-6",
				title: "font-semibold text-lg leading-none",
				description: "text-sm",
				closeButton: "top-4 right-4",
				body: "-mx-6 in-data-popover:-mx-4 in-data-popover:px-4 px-6",
			},
		},
	},
});

export type DialogStyles = typeof styles;

export { useStyles };
