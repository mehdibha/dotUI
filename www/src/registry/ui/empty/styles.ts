import { createStyles } from "@/modules/core/styles";

import emptyMeta from "./meta";

const { useStyles, styles } = createStyles(emptyMeta, {
	base: {
		slots: {
			base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
			header: "flex max-w-sm flex-col items-center gap-2 text-center",
			title: "font-medium text-lg tracking-tight",
			description: "text-fg-muted text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
			content: "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
			media: "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
		},
		variants: {
			variant: {
				default: {
					media: "bg-transparent",
				},
				icon: {
					media: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-fg [&_svg:not([class*='size-'])]:size-6",
				},
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type EmptyStyles = typeof styles;

export { useStyles };
