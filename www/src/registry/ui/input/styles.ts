import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup: [
				"group/input-group relative flex h-(--input-h) w-full min-w-0 items-center",
				// unstyle any input-control, make it fill the parent
				"**:data-input-control:flex-1 **:data-input-control:rounded-none **:data-input-control:border-0 **:data-input-control:bg-transparent **:data-input-control:px-0 **:data-input-control:ring-0",
				// with textarea
				"has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
				// temp: declare css vars here
				"[--addon-button-inset:var(--spacing)] [--addon-gap:calc(var(--spacing)*1)] [--edge-to-text:calc(var(--spacing)*3)] [--edge-to-visual:calc(var(--spacing)*2)] [--icon-size:calc(var(--spacing)*3.5)] [--text-to-visual:calc(var(--spacing)*1.5)]",
			],
			inputGroupAddon: [
				"flex cursor-text select-none items-center justify-center gap-(--addon-gap)",
				"text-fg-muted *:[svg]:not-with-[size]:size-(--icon-size)",
				// with textarea
				"group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start",
			],
			input: [
				"w-full outline-none",
				"h-(--input-h) in-data-input-group:h-auto",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
				// temp: declare css vars here
				"[--edge-to-text:calc(var(--spacing)*3)]",
			],
			textArea: [
				"min-h-16 w-full resize-none outline-none",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
				// temp: declare css vars here
				"[--edge-to-text:calc(var(--spacing)*3)]",
			],
			dateInputSegment: "",
		},
		variants: {
			size: {
				sm: {},
				md: {},
				lg: {},
			},
		},
		defaultVariants: {
			size: "md",
		},
	},

	/* -------------------- Density -------------------- */

	density: {
		compact: {
			slots: {
				inputGroup: "text-sm sm:text-xs/relaxed",
				input: "text-sm sm:text-xs/relaxed",
				textArea: "text-sm sm:text-xs/relaxed",
			},
			variants: {
				size: {
					sm: {
						inputGroup: "[--input-h:calc(var(--spacing)*6)]",
						input: "[--input-h:calc(var(--spacing)*6)]",
					},
					md: {
						inputGroup: "[--input-h:calc(var(--spacing)*7)]",
						input: "[--input-h:calc(var(--spacing)*7)]",
					},
					lg: {
						inputGroup: "[--input-h:calc(var(--spacing)*8)]",
						input: "[--input-h:calc(var(--spacing)*8)]",
					},
				},
			},
		},
		default: {
			slots: {
				inputGroup: "text-base sm:text-sm",
				input: "text-base sm:text-sm",
				textArea: "text-base sm:text-sm",
			},
			variants: {
				size: {
					sm: {
						inputGroup: "[--input-h:calc(var(--spacing)*7)]",
						input: "[--input-h:calc(var(--spacing)*7)]",
					},
					md: {
						inputGroup: "[--input-h:calc(var(--spacing)*8)]",
						input: "[--input-h:calc(var(--spacing)*8)]",
					},
					lg: {
						inputGroup: "[--input-h:calc(var(--spacing)*9)]",
						input: "[--input-h:calc(var(--spacing)*9)]",
					},
				},
			},
		},
		comfortable: {
			slots: {
				inputGroup: "text-base sm:text-sm",
				input: "text-base sm:text-sm",
				textArea: "text-base sm:text-sm",
			},
			variants: {
				size: {
					sm: {
						inputGroup: "[--input-h:calc(var(--spacing)*8)]",
						input: "[--input-h:calc(var(--spacing)*8)]",
					},
					md: {
						inputGroup: "[--input-h:calc(var(--spacing)*9)]",
						input: "[--input-h:calc(var(--spacing)*9)]",
					},
					lg: {
						inputGroup: "[--input-h:calc(var(--spacing)*10)] **:[svg]:not-with-[size]:size-4.5",
						input: "[--input-h:calc(var(--spacing)*10)]",
					},
				},
			},
		},
	},

	/* -------------------- Styles -------------------- */

	styles: {
		// Bordered — neutral default.
		outline: {
			slots: {
				inputGroup: [
					"rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:not-invalid:border-border-focus has-[[data-input-control][data-focused]]:not-invalid:ring-border-focus-muted has-[[data-input-control][data-focused]]:ring-2",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
					// with addons and input
					"has-data-input:has-[[data-input-group-addon]:last-child]:pr-0 has-data-input:has-[[data-input-group-addon]:first-child]:pl-0",
				],
				input: [
					"rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
				],
				textArea: [
					"rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
				],
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)]",
					// nested button, with input
					"group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)] **:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
				],
			},
		},

		// Bottom-border only — flush to edge, no horizontal padding.
		line: {
			slots: {
				inputGroup: [
					"border-border-field border-b",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:not-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled",
					// invalid
					"invalid:border-border-danger invalid:has-[[data-input-control][data-focused]]:border-fg-danger",
					// with addons and input
					"has-data-input:has-[[data-input-group-addon]:last-child]:pr-0 has-data-input:has-[[data-input-group-addon]:first-child]:pl-0",
				],
				input: [
					"border-border-field border-b",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled",
					// invalid
					"invalid:border-border-danger invalid:focus:border-fg-danger",
				],
				textArea: [],
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:pl-(--text-to-visual) group-has-data-input/input-group:first:pr-(--text-to-visual)",
					// nested button, with input
					"**:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
				],
			},
		},

		// Soft tinted fill, bottom border only.
		"filled-line-bottom": {
			slots: {
				inputGroup: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:not-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger",
					// with addons and input
					"has-data-input:has-[[data-input-group-addon]:last-child]:pr-0 has-data-input:has-[[data-input-group-addon]:first-child]:pl-0",
				],
				input: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger",
				],
				textArea: [],
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)]",
					// nested button, with input
					"group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)] **:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
				],
			},
		},

		// Soft tinted fill, no visible border until focus.
		filled: {
			slots: {
				inputGroup: [
					"rounded-(--input-radius) border border-transparent bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:not-invalid:border-border-focus has-[[data-input-control][data-focused]]:not-invalid:ring-border-focus-muted has-[[data-input-control][data-focused]]:ring-2",
					// disabled
					"disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
					// with addons and input
					"has-data-input:has-[[data-input-group-addon]:last-child]:pr-0 has-data-input:has-[[data-input-group-addon]:first-child]:pl-0",
				],
				input: [
					"rounded-(--input-radius) border border-transparent bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
				],
				textArea: [],
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)]",
					// nested button, with input
					"group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)] **:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
				],
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
