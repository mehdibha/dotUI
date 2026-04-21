import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup:
				"group/input-group focus-reset focus-within:focus-input relative flex w-full min-w-0 items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			inputGroupAddon: ["flex h-auto shrink-0 cursor-text select-none items-center justify-center"],
			input:
				"focus-reset not-in-data-input-group:focus:focus-input w-full min-w-0 rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			textArea:
				"focus-reset not-in-data-input-group:focus:focus-input min-h-16 w-full min-w-0 resize-none rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			dateInput:
				"inline-flex w-full min-w-0 cursor-text items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			dateInputSegment: "",
		},
		variants: {
			orientation: {
				horizontal: { inputGroup: "flex-row" },
				vertical: {
					inputGroup: "h-auto flex-col items-stretch",
					inputGroupAddon: "items-center justify-start",
					input: "flex-1",
					textArea: "flex-1",
				},
			},
			size: {
				sm: {},
				md: {},
				lg: {},
			},
		},
		defaultVariants: { size: "md", orientation: "horizontal" },
	},
	density: {
		compact: {
			slots: {
				inputGroup: "text-xs/relaxed has-data-textarea:h-auto!",
				input: "text-sm sm:text-xs/relaxed",
				inputGroupAddon: "gap-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3",
				textArea:
					"px-2 not-in-data-input-group:py-1 text-sm first:in-data-input-group:pt-1 last:in-data-input-group:pb-1 sm:text-xs/relaxed",
			},
			variants: {
				orientation: {
					vertical: {
						inputGroupAddon: "px-2 first:pt-2 last:pb-2 first:[.border-b]:pb-2 last:[.border-t]:pt-2",
						input: "flex-1",
					},
				},
				size: {
					sm: {
						inputGroup:
							"orientation-horizontal:h-6 orientation-horizontal:has-[>:first-child[data-input-group-addon]]:**:data-input:pl-1.25",
						input:
							"h-6 px-2 last:group-orientation-vertical/input-group:pt-0.5 last:group-orientation-vertical/input-group:pb-1 first:group-orientation-vertical/input-group:pt-2 first:group-orientation-vertical/input-group:pb-0.5",
						inputGroupAddon: [
							"orientation-horizontal:first:pl-1.5 orientation-horizontal:last:pr-1.5 orientation-horizontal:last:has-[>button]:mr-[-0.2rem] orientation-horizontal:first:has-[>button]:ml-[-0.2rem] **:data-button:data-icon-only:size-4 **:data-button:h-4 **:data-button:rounded-sm",
							"orientation-horizontal:last:has-data-kbd:mr-[-0.2rem] orientation-horizontal:first:has-data-kbd:ml-[-0.2rem] *:data-kbd:h-4 *:data-kbd:min-w-4 *:data-kbd:px-1 *:data-kbd:text-[0.625rem]",
						],
					},
					md: {
						inputGroup:
							"orientation-horizontal:h-7 orientation-horizontal:has-[>:first-child[data-input-group-addon]]:**:data-input:pl-1.5",
						input:
							"h-7 px-2 last:group-orientation-vertical/input-group:pt-1 last:group-orientation-vertical/input-group:pb-2 first:group-orientation-vertical/input-group:pt-2 first:group-orientation-vertical/input-group:pb-1",
						inputGroupAddon: [
							"orientation-horizontal:first:pl-2 orientation-horizontal:last:pr-2 orientation-horizontal:last:has-[>button]:mr-[-0.28rem] orientation-horizontal:first:has-[>button]:ml-[-0.28rem] **:data-button:data-icon-only:size-5 **:data-button:h-5 **:data-button:rounded-sm",
							"orientation-horizontal:last:has-data-kbd:mr-[-0.28rem] orientation-horizontal:first:has-data-kbd:ml-[-0.28rem] *:data-kbd:h-5 *:data-kbd:min-w-5 *:data-kbd:px-1 *:data-kbd:text-[0.625rem]",
						],
					},
					lg: {
						inputGroup:
							"orientation-horizontal:h-8 orientation-horizontal:has-[>:first-child[data-input-group-addon]]:**:data-input:pl-1.75",
						input:
							"h-8 px-2.5 last:group-orientation-vertical/input-group:pt-1.5 last:group-orientation-vertical/input-group:pb-2.5 first:group-orientation-vertical/input-group:pt-2.5 first:group-orientation-vertical/input-group:pb-1.5",
						inputGroupAddon: [
							"orientation-horizontal:first:pl-2.5 orientation-horizontal:last:pr-2.5 orientation-horizontal:last:has-[>button]:mr-[-0.4rem] orientation-horizontal:first:has-[>button]:ml-[-0.4rem] **:data-button:data-icon-only:size-6 **:data-button:h-6 **:data-button:rounded-sm",
							"orientation-horizontal:last:has-data-kbd:mr-[-0.4rem] orientation-horizontal:first:has-data-kbd:ml-[-0.4rem] *:data-kbd:h-5 *:data-kbd:min-w-5 *:data-kbd:px-1.5 *:data-kbd:text-xs",
						],
					},
				},
			},
		},
		default: {
			slots: { input: "text-base sm:text-sm" },
			variants: {
				size: {
					sm: { inputGroup: "h-7", input: "h-7 px-2" },
					md: { inputGroup: "h-8", input: "h-8 px-2.5" },
					lg: { inputGroup: "h-9", input: "h-9 px-3" },
				},
			},
		},
		comfortable: {
			slots: { input: "text-base sm:text-sm" },
			variants: {
				size: {
					sm: { inputGroup: "h-8", input: "h-8 px-2.5" },
					md: { inputGroup: "h-9", input: "h-9 px-3" },
					lg: { inputGroup: "h-10", input: "h-10 px-3" },
				},
			},
		},
	},
	styles: {
		default: {
			slots: {
				inputGroup: [
					"focus-reset border border-border-field bg-card",
					"has-data-input:disabled:border-border-disabled has-data-input:disabled:bg-disabled has-data-input:disabled:text-fg-disabled",
					"has-data-textarea:disabled:border-border-disabled has-data-textarea:disabled:bg-disabled has-data-textarea:disabled:text-fg-disabled",
					"has-data-input:invalid:border-border-danger has-data-textarea:invalid:border-border-danger has-data-input:invalid:text-fg-danger has-data-textarea:invalid:text-fg-danger has-data-input:invalid:ring-danger-muted has-data-textarea:invalid:ring-danger-muted", 
				],
				input: "not-in-data-input-group:border border-border-field not-in-data-input-group:bg-card",
				inputGroupAddon: "font-medium text-fg-muted",
				textArea: "not-in-data-input-group:border border-border-field not-in-data-input-group:bg-card",
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
