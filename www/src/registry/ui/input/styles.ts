import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup:
				"group/input-group relative flex w-full min-w-0 items-center rounded-(--input-radius) transition-[color,box-shadow,border-color] focus-reset focus-within:focus-input",
			inputGroupAddon: [
				"flex shrink-0 cursor-text select-none items-center justify-center",
				"text-fg-muted h-auto gap-1 py-2 text-xs/relaxed font-medium group-data-[disabled=true]/input-group:opacity-50  **:[svg]:not-with-[size]:size-3",
				"",
			],
			input: "w-full min-w-0 rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			textArea: "w-full min-w-0 rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			dateInput:
				"inline-flex w-full min-w-0 cursor-text items-center rounded-(--input-radius) transition-[color,box-shadow,border-color]",
			dateInputSegment: "",
		},
		variants: {
			orientation: {
				horizontal: { inputGroup: "flex-row" },
				vertical: { inputGroup: "flex-col items-stretch h-auto" },
			},
			size: {
				sm: {
					inputGroup: "has-[>:first-child[data-input-group-addon]]:**:data-input:pl-1.25",
				},
				md: { inputGroup: "has-[>:first-child[data-input-group-addon]]:**:data-input:pl-1.5" },
				lg: { inputGroup: "has-[>:first-child[data-input-group-addon]]:**:data-input:pl-1.75" },
			},
		},
		defaultVariants: { size: "md", orientation: "horizontal" },
	},
	density: {
		compact: {
			slots: {
				input: "text-sm md:text-xs/relaxed",
				inputGroupAddon: [
					// sm
					"group-data-[size=sm]/input-group:**:data-button:h-4 first:group-data-[size=sm]/input-group:group-orientation-horizontal/input-group:pl-1.5 last:group-data-[size=sm]/input-group:group-orientation-horizontal/input-group:pr-1.5 first:group-data-[size=sm]/input-group:group-orientation-horizontal/input-group:has-[>button]:ml-[-0.2rem]",
					// md
					"**:data-button:h-5 first:group-orientation-horizontal/input-group:pl-2 last:group-orientation-horizontal/input-group:pr-2 first:group-orientation-horizontal/input-group:has-[>button]:ml-[-0.275rem]",
					// lg
					"group-data-[size=lg]/input-group:**:data-button:h-6 first:group-data-[size=lg]/input-group:group-orientation-horizontal/input-group:pl-2.5 last:group-data-[size=lg]/input-group:group-orientation-horizontal/input-group:pr-2.5 first:group-data-[size=lg]/input-group:group-orientation-horizontal/input-group:has-[>button]:ml-[-0.35rem]",
				],
			},
			variants: {
				size: {
					sm: { inputGroup: "h-6", input: "h-6 px-2" },
					md: { inputGroup: "h-7", input: "h-7 px-2" },
					lg: { inputGroup: "h-8", input: "h-8 px-2.5" },
				},
			},
		},
		default: {
			slots: { input: "text-base md:text-sm" },
			variants: {
				size: {
					sm: { inputGroup: "h-7", input: "h-7 px-2" },
					md: { inputGroup: "h-8", input: "h-8 px-2.5" },
					lg: { inputGroup: "h-9", input: "h-9 px-3" },
				},
			},
		},
		comfortable: {
			slots: { input: "text-base md:text-sm" },
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
				inputGroup: "focus-reset border border-border-field bg-neutral",
				input:
					"focus-reset not-in-data-input-group:focus:focus-input not-in-data-input-group:border border-border-field not-in-data-input-group:bg-neutral",
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
