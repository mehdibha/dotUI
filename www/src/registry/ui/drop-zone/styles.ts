import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import dropZoneMeta from "./meta";

const baseStyles = tv({
	slots: {
		dropzone: "",
		label: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		dropzone:
			"flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 drop-target:border-border-focus border-dashed drop-target:bg-accent-muted p-6 text-sm focus-visible:border-border-focus disabled:border-border-disabled disabled:text-fg-disabled",
		label: "text-base",
	},
});

export type DropZoneStyles = typeof defaultStyles;

export const { useStyles } = createStyles(dropZoneMeta, {
	default: defaultStyles,
});
