import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import commandMeta from "./meta";

const baseStyles = tv({
	slots: {
		base: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		base: [
			"in-drawer:rounded-[inherit] in-modal:rounded-[inherit] in-popover:rounded-[inherit] rounded-lg not-in-popover:not-in-modal:not-in-drawer:border not-in-popover:not-in-modal:not-in-drawer:bg-card",
			"**:data-[slot=list-box]:w-full **:data-[slot=list-box]:border-0 **:data-[slot=list-box]:bg-transparent",
			"**:data-[slot=search-field]:w-full **:data-[slot=search-field]:outline-none [&_[data-slot=search-field]_[data-slot=input-group]]:rounded-b-none [&_[data-slot=search-field]_[data-slot=input-group]]:border-0 [&_[data-slot=search-field]_[data-slot=input-group]]:border-b [&_[data-slot=search-field]_[data-slot=input-group]]:bg-transparent",
			"in-modal:w-full",
		],
	},
});

export type CommandStyles = typeof defaultStyles;

export const { useStyles } = createStyles(commandMeta, {
	default: defaultStyles,
});
