import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup: [
				"group/input-group relative flex h-(--input-h) w-full min-w-0 items-center",
				// with textarea
				"has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full **:data-input:flex-1",
				// with date input
				"**:data-input:flex-1",
				// disabled
				"has-disabled:cursor-disabled",
			],
			inputGroupAddon: [
				"flex cursor-text select-none items-center justify-center",
				// with textarea
				"group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start",
			],
			input: ["outline-none", "h-(--input-h) in-data-input-group:h-auto", "disabled:cursor-disabled"],
			textArea: ["resize-none outline-none"],
			dateInput: [],
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

	density: {
		compact: {
			slots: {
				inputGroup: "text-sm sm:text-xs/relaxed",
				input: "text-sm sm:text-xs/relaxed",
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

	styles: {
		// Bordered — neutral default.
		outline: {
			slots: {
				inputGroup: [
					"rounded-(--input-radius) border border-border-field bg-field",
					// unstyle input
					"**:data-input:rounded-none **:data-input:border-none **:data-input:bg-transparent",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:border-border-focus has-[[data-input-control][data-focused]]:ring-2 has-[[data-input-control][data-focused]]:ring-border-focus-muted",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-onMutedDanger",
				],
				input: "rounded-(--input-radius) border border-border-field bg-field",
				textArea: "",
				dateInput: "",
				inputGroupAddon: "",
			},
		},

		// Bottom-border only — flush to edge, no horizontal padding.
		line: {
			slots: {
				inputGroup: [
					"border-border-field border-b bg-field",
					// unstyle input
					"**:data-input:rounded-none **:data-input:border-none **:data-input:bg-transparent",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:border-border-focus",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-onMutedDanger",
				],
				input: "border-border-field border-b bg-field",
				textArea: "",
				dateInput: "",
				inputGroupAddon: "",
			},
		},

		// Soft tinted fill, bottom border only.
		"filled-line-bottom": {
			slots: {
				inputGroup: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field",
					// unstyle input
					"**:data-input:border-none **:data-input:bg-transparent",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:border-border-focus",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-onMutedDanger",
				],
				input: "rounded-t-(--input-radius) border-border-field border-b bg-field",
				textArea: "",
				dateInput: "",
				inputGroupAddon: "",
			},
		},

		// Soft tinted fill, no visible border until focus.
		filled: {
			slots: {
				inputGroup: [
					"rounded-(--input-radius) bg-field",
					// unstyle input
					"**:data-input:rounded-none **:data-input:border-none **:data-input:bg-transparent",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"has-[[data-input-control][data-focused]]:border-border-focus has-[[data-input-control][data-focused]]:ring-2 has-[[data-input-control][data-focused]]:ring-border-focus-muted",
					// disabled
					"has-disabled:border-border-disabled has-disabled:bg-disabled has-disabled:text-fg-disabled",
					// invalid
					"has-invalid:border-border-danger has-invalid:text-fg-onMutedDanger",
				],
				input: "rounded-(--input-radius) bg-field",
				textArea: "",
				dateInput: "",
				inputGroupAddon: "",
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
