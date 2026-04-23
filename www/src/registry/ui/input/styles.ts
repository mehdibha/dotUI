import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup: [
				"group/input-group relative flex h-(--input-h) w-full min-w-0 items-center",
				// unstyle input, textarea, and date input
				"**:data-input-control:rounded-none **:data-input-control:border-0 **:data-input-control:bg-transparent **:data-input-control:ring-0",
				// with textarea
				"has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full **:data-input:flex-1",
				// with date input
				"**:data-input:flex-1",
				// disabled
				"disabled:text-fg-disabled has-disabled:cursor-disabled",
			],
			inputGroupAddon: [
				"flex cursor-text select-none items-center justify-center",
				"text-fg-muted",
				// with textarea
				"group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start",
			],
			input: [
				"w-full outline-none",
				"h-(--input-h) in-data-input-group:h-auto",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
			],
			textArea: [
				"min-h-16 w-full resize-none outline-none",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
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
						inputGroup: "[--input-h:calc(var(--spacing)*6)] **:[svg]:not-with-[size]:size-3",
						input: "[--input-h:calc(var(--spacing)*6)]",
					},
					md: {
						inputGroup: "[--input-h:calc(var(--spacing)*7)] **:[svg]:not-with-[size]:size-3.5",
						input: "[--input-h:calc(var(--spacing)*7)]",
					},
					lg: {
						inputGroup: "[--input-h:calc(var(--spacing)*8)] **:[svg]:not-with-[size]:size-4",
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
						inputGroup: "[--input-h:calc(var(--spacing)*7)] **:[svg]:not-with-[size]:size-3.5",
						input: "[--input-h:calc(var(--spacing)*7)]",
					},
					md: {
						inputGroup: "[--input-h:calc(var(--spacing)*8)] **:[svg]:not-with-[size]:size-4",
						input: "[--input-h:calc(var(--spacing)*8)]",
					},
					lg: {
						inputGroup: "[--input-h:calc(var(--spacing)*9)] **:[svg]:not-with-[size]:size-4",
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
						inputGroup: "[--input-h:calc(var(--spacing)*8)] **:[svg]:not-with-[size]:size-4",
						input: "[--input-h:calc(var(--spacing)*8)]",
					},
					md: {
						inputGroup: "[--input-h:calc(var(--spacing)*9)] **:[svg]:not-with-[size]:size-4",
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
					"rounded-(--input-radius) border border-border-field bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]:not([data-invalid])]:border-border-focus has-[[data-input-control][data-focused]:not([data-invalid])]:ring-border-focus-muted has-[[data-input-control][data-focused]]:ring-2",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-danger has-invalid:ring-danger-muted",
				],
				input: [
					"rounded-(--input-radius) border border-border-field bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-data-invalid:border-border-focus focus:not-data-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:text-fg-danger invalid:ring-danger-muted",
				],
				textArea: [
					"rounded-(--input-radius) border border-border-field bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-data-invalid:border-border-focus focus:not-data-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:text-fg-danger invalid:ring-danger-muted",
				],
				dateInput: "",
				inputGroupAddon: "",
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
					"has-[[data-input-control][data-focused]:not([data-invalid])]:border-border-focus",
					// disabled
					"has-disabled:border-border-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-danger",
				],
				input: [
					"border-border-field border-b",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-data-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled",
					// invalid
					"invalid:border-border-danger invalid:text-fg-danger",
				],
				textArea: [],
				inputGroupAddon: "",
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
					"has-[[data-input-control][data-focused]]:border-border-focus",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-onMutedDanger",
				],
				input: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:border-border-focus",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"aria-invalid:border-border-danger aria-invalid:text-fg-onMutedDanger",
				],
				textArea: [],
				inputGroupAddon: "",
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
					"has-[[data-input-control][data-focused]]:border-border-focus has-[[data-input-control][data-focused]]:ring-2 has-[[data-input-control][data-focused]]:ring-border-focus-muted",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-onMutedDanger",
				],
				input: [
					"rounded-(--input-radius) border border-transparent bg-field",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:border-border-focus focus:ring-2 focus:ring-border-focus-muted",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"aria-invalid:border-border-danger aria-invalid:text-fg-onMutedDanger aria-invalid:ring-danger-muted",
				],
				textArea: [],
				inputGroupAddon: "",
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
