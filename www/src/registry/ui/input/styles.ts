import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

// Per-height token sets (tuned from shadcn mira/nova/vega + extrapolation for h-6/h-10)
const h6 =
	"[--edge-to-text:calc(var(--spacing)*2)] [--edge-to-visual:calc(var(--spacing)*1.5)] [--text-to-visual:calc(var(--spacing)*1.5)] [--top-to-text:calc(var(--spacing)*2)] [--icon-size:calc(var(--spacing)*3)] [--addon-gap:var(--spacing)] [--addon-button-inset:var(--spacing)]";
const h7 =
	"[--edge-to-text:calc(var(--spacing)*2)] [--edge-to-visual:calc(var(--spacing)*1.5)] [--text-to-visual:calc(var(--spacing)*1.5)] [--top-to-text:calc(var(--spacing)*2)] [--icon-size:calc(var(--spacing)*3.5)] [--addon-gap:var(--spacing)] [--addon-button-inset:var(--spacing)]";
const h8 =
	"[--edge-to-text:calc(var(--spacing)*2.5)] [--edge-to-visual:calc(var(--spacing)*2)] [--text-to-visual:calc(var(--spacing)*1.5)] [--top-to-text:calc(var(--spacing)*2)] [--icon-size:calc(var(--spacing)*4)] [--addon-gap:calc(var(--spacing)*2)] [--addon-button-inset:calc(var(--spacing)*1.5)]";
const h9 =
	"[--edge-to-text:calc(var(--spacing)*2.5)] [--edge-to-visual:calc(var(--spacing)*2)] [--text-to-visual:calc(var(--spacing)*1.5)] [--top-to-text:calc(var(--spacing)*2)] [--icon-size:calc(var(--spacing)*4)] [--addon-gap:calc(var(--spacing)*2)] [--addon-button-inset:calc(var(--spacing)*1.5)]";
const h10 =
	"[--edge-to-text:calc(var(--spacing)*3)] [--edge-to-visual:calc(var(--spacing)*2.5)] [--text-to-visual:calc(var(--spacing)*1.5)] [--top-to-text:calc(var(--spacing)*2)] [--icon-size:calc(var(--spacing)*4.5)] [--addon-gap:calc(var(--spacing)*2)] [--addon-button-inset:calc(var(--spacing)*1.5)]";

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup: [
				"group/input-group relative flex h-(--input-h) w-full min-w-0 items-center",
				// unstyle any input-control, make it fill the parent
				"**:data-input-control:flex-1 **:data-input-control:rounded-none **:data-input-control:border-0 **:data-input-control:bg-transparent **:data-input-control:ring-0",
				// strip horizontal padding only for inline controls; textarea owns its own
				"**:data-date-input:px-0 **:data-input:px-0",
				// with textarea
				"has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
			],
			inputGroupAddon: [
				"flex cursor-text select-none items-center justify-center gap-(--addon-gap)",
				"text-fg-muted *:[svg]:not-with-[size]:size-(--icon-size)",
				// with textarea
				"group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start",
			],
			input: [
				"inline-flex w-full cursor-text items-center outline-none",
				"h-(--input-h) in-data-input-group:h-auto",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
			],
			textArea: [
				"min-h-16 w-full resize-none py-(--top-to-text) outline-none",
				// disabled
				"disabled:cursor-disabled disabled:text-fg-disabled",
			],
			dateInputSegment:
				"select-none rounded px-0.5 type-literal:px-0 outline-hidden placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-fg-disabled",
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
						inputGroup: `[--input-h:calc(var(--spacing)*6)] ${h6}`,
						input: `[--input-h:calc(var(--spacing)*6)] ${h6}`,
						textArea: h6,
					},
					md: {
						inputGroup: `[--input-h:calc(var(--spacing)*7)] ${h7}`,
						input: `[--input-h:calc(var(--spacing)*7)] ${h7}`,
						textArea: h7,
					},
					lg: {
						inputGroup: `[--input-h:calc(var(--spacing)*8)] ${h8}`,
						input: `[--input-h:calc(var(--spacing)*8)] ${h8}`,
						textArea: h8,
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
						inputGroup: `[--input-h:calc(var(--spacing)*7)] ${h7}`,
						input: `[--input-h:calc(var(--spacing)*7)] ${h7}`,
						textArea: h7,
					},
					md: {
						inputGroup: `[--input-h:calc(var(--spacing)*8)] ${h8}`,
						input: `[--input-h:calc(var(--spacing)*8)] ${h8}`,
						textArea: h8,
					},
					lg: {
						inputGroup: `[--input-h:calc(var(--spacing)*9)] ${h9}`,
						input: `[--input-h:calc(var(--spacing)*9)] ${h9}`,
						textArea: h9,
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
						inputGroup: `[--input-h:calc(var(--spacing)*8)] ${h8}`,
						input: `[--input-h:calc(var(--spacing)*8)] ${h8}`,
						textArea: h8,
					},
					md: {
						inputGroup: `[--input-h:calc(var(--spacing)*9)] ${h9}`,
						input: `[--input-h:calc(var(--spacing)*9)] ${h9}`,
						textArea: h9,
					},
					lg: {
						inputGroup: `[--input-h:calc(var(--spacing)*10)] ${h10}`,
						input: `[--input-h:calc(var(--spacing)*10)] ${h10}`,
						textArea: h10,
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
					// with textarea — addon spans edge-to-edge
					"has-data-textarea:px-0",
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
					// nested button: input-mode first/last inset
					"group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)]",
					// nested button: shared radius across modes; h/w only in input mode (textarea uses natural h/w)
					"**:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
					// with textarea — addon strip spans full width
					"group-has-data-textarea/input-group:px-(--edge-to-text)",
					"group-has-data-textarea/input-group:last:pb-(--edge-to-text) group-has-data-textarea/input-group:first:pt-(--edge-to-text)",
					// pt/pb only when user adds a separator border
					"group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)",
					// nested button: textarea-mode inline inset (first/last position in addon)
					"group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text)",
					// nested button: textarea-mode block inset (addon at block-end/start)
					"group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text)",
					"group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)",
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
				textArea: [
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
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:pl-(--text-to-visual) group-has-data-input/input-group:first:pr-(--text-to-visual)",
					// nested button: shared radius across modes; h/w only in input mode (textarea uses natural h/w)
					"**:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
					// with textarea — addon strip spans full width
					"group-has-data-textarea/input-group:px-(--edge-to-text)",
					"group-has-data-textarea/input-group:last:pb-(--edge-to-text) group-has-data-textarea/input-group:first:pt-(--edge-to-text)",
					// pt/pb only when user adds a separator border
					"group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)",
					// nested button: textarea-mode inline inset (first/last position in addon)
					"group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text)",
					// nested button: textarea-mode block inset (addon at block-end/start)
					"group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text)",
					"group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)",
				],
			},
		},

		// Soft tinted fill, bottom border only.
		"filled-line-bottom": {
			slots: {
				inputGroup: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field px-(--edge-to-text)",
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
					// with textarea — addon spans edge-to-edge
					"has-data-textarea:px-0",
				],
				input: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger",
				],
				textArea: [
					"rounded-t-(--input-radius) border-border-field border-b bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus",
					// disabled
					"disabled:border-border-disabled disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger",
				],
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)]",
					// nested button: input-mode first/last inset
					"group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)]",
					// nested button: shared radius across modes; h/w only in input mode (textarea uses natural h/w)
					"**:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
					// with textarea — addon strip spans full width
					"group-has-data-textarea/input-group:px-(--edge-to-text)",
					"group-has-data-textarea/input-group:last:pb-(--edge-to-text) group-has-data-textarea/input-group:first:pt-(--edge-to-text)",
					// pt/pb only when user adds a separator border
					"group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)",
					// nested button: textarea-mode inline inset (first/last position in addon)
					"group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text)",
					// nested button: textarea-mode block inset (addon at block-end/start)
					"group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text)",
					"group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)",
				],
			},
		},

		// Soft tinted fill, no visible border until focus.
		filled: {
			slots: {
				inputGroup: [
					"rounded-(--input-radius) border border-transparent bg-field px-(--edge-to-text)",
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
					// with textarea — addon spans edge-to-edge
					"has-data-textarea:px-0",
				],
				input: [
					"rounded-(--input-radius) border border-transparent bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
				],
				textArea: [
					"rounded-(--input-radius) border border-transparent bg-field px-(--edge-to-text)",
					// transition
					"transition-[box-shadow,border-color,color]",
					// focused
					"focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
					// disabled
					"disabled:bg-disabled",
					// invalid
					"invalid:border-border-danger invalid:ring-danger-muted",
				],
				inputGroupAddon: [
					// with input
					"group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)]",
					// nested button: input-mode first/last inset
					"group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)]",
					// nested button: shared radius across modes; h/w only in input mode (textarea uses natural h/w)
					"**:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
					// with textarea — addon strip spans full width
					"group-has-data-textarea/input-group:px-(--edge-to-text)",
					"group-has-data-textarea/input-group:last:pb-(--edge-to-text) group-has-data-textarea/input-group:first:pt-(--edge-to-text)",
					// pt/pb only when user adds a separator border
					"group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)",
					// nested button: textarea-mode inline inset (first/last position in addon)
					"group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text)",
					// nested button: textarea-mode block inset (addon at block-end/start)
					"group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text)",
					"group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)",
				],
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
