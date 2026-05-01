import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

/* -------------------------------- Tokens -------------------------------- */

// Per-height token sets (tuned from shadcn mira/nova/vega + extrapolation for h-6/h-10).
const tokens = tv({
	variants: {
		h: {
			6: "[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3)] [--input-h:--spacing(6)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
			7: "[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3.5)] [--input-h:--spacing(7)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
			8: "[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(8)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
			9: "[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(9)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
			10: "[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(3)] [--edge-to-visual:--spacing(2.5)] [--icon-size:--spacing(4.5)] [--input-h:--spacing(10)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
		},
	},
});

const compactText = "text-sm sm:text-xs/relaxed";
const defaultText = "text-base sm:text-sm";

/* ----------------------------- Field shells ----------------------------- */

// Each field tv exposes `focus: self | group` because input/textarea react to
// their own `:focus` while inputGroup must react to `[data-focused]` on the
// nested input-control.

const outlineField = tv({
	base: "rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text) transition-[box-shadow,border-color,color] invalid:border-border-danger invalid:ring-danger-muted disabled:border-border-disabled disabled:bg-disabled",
	variants: {
		focus: {
			self: "focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
			group:
				"group-focus/combobox:not-invalid:border-border-focus group-focus/combobox:not-invalid:ring-border-focus-muted group-focus/combobox:ring-2 has-[[data-input-control][data-focused]]:not-invalid:border-border-focus has-[[data-input-control][data-focused]]:not-invalid:ring-border-focus-muted has-[[data-input-control][data-focused]]:ring-2",
		},
	},
});

const lineField = tv({
	base: "border-border-field border-b transition-[box-shadow,border-color,color] invalid:border-border-danger disabled:border-border-disabled",
	variants: {
		focus: {
			self: "focus:not-invalid:border-border-focus invalid:focus:border-fg-danger",
			group:
				"group-focus/combobox:not-invalid:border-border-focus invalid:group-focus/combobox:border-fg-danger has-[[data-input-control][data-focused]]:not-invalid:border-border-focus invalid:has-[[data-input-control][data-focused]]:border-fg-danger",
		},
	},
});

const filledLineBottomField = tv({
	base: "rounded-t-(--input-radius) border-border-field border-b bg-field px-(--edge-to-text) transition-[box-shadow,border-color,color] invalid:border-border-danger disabled:border-border-disabled disabled:bg-disabled",
	variants: {
		focus: {
			self: "focus:not-invalid:border-border-focus",
			group:
				"group-focus/combobox:not-invalid:border-border-focus has-[[data-input-control][data-focused]]:not-invalid:border-border-focus",
		},
	},
});

const filledField = tv({
	base: "rounded-(--input-radius) border border-transparent bg-field px-(--edge-to-text) transition-[box-shadow,border-color,color] invalid:border-border-danger invalid:ring-danger-muted disabled:bg-disabled",
	variants: {
		focus: {
			self: "focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted focus:ring-2",
			group:
				"group-focus/combobox:not-invalid:border-border-focus group-focus/combobox:not-invalid:ring-border-focus-muted group-focus/combobox:ring-2 has-[[data-input-control][data-focused]]:not-invalid:border-border-focus has-[[data-input-control][data-focused]]:not-invalid:ring-border-focus-muted has-[[data-input-control][data-focused]]:ring-2",
		},
	},
});

/* ----------------------------- Addon helpers ----------------------------- */
// Per-style addon helpers (style-specific). Cross-style addon rules live in
// `base.inputGroupAddon` / `base.inputGroup` below.

// Paradigm B (outline / filled / filled-line-bottom) — addon owns asymmetric inline padding.
const addonInputModeParadigmB =
	"group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)] group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)]";

// Line style — symmetric inline padding (no bg/border to "yield to").
const addonInputModeLine =
	"group-has-data-input/input-group:last:pl-(--text-to-visual) group-has-data-input/input-group:first:pr-(--text-to-visual)";

/* -------------------------------------------------------------------------- */

const { useStyles, styles } = createStyles(inputMeta, {
	base: {
		slots: {
			inputGroup: [
				"group/input-group relative flex h-(--input-h) w-full min-w-0 items-center",
				"**:data-input-control:flex-1 **:data-input-control:rounded-none **:data-input-control:border-0 **:data-input-control:bg-transparent **:data-input-control:ring-0",
				"**:data-date-input:px-0 **:data-input:px-0",
				"has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full",
				"has-data-input:has-[[data-input-group-addon]:last-child]:pr-0 has-data-input:has-[[data-input-group-addon]:first-child]:pl-0",
				"has-data-textarea:px-0",
				"disabled:cursor-disabled disabled:text-fg-disabled",
				"has-data-combobox-value:h-auto has-data-combobox-value:min-h-(--input-h) has-data-combobox-value:flex-wrap has-data-combobox-value:items-center has-data-combobox-value:gap-1 has-data-combobox-value:py-(--addon-button-inset) has-data-combobox-value:pl-(--addon-button-inset) **:data-combobox-value:contents **:data-tag-group:contents **:data-tag-list:contents **:data-tag:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] **:data-tag:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] has-data-combobox-value:has-[[data-tag-list][data-empty]]:**:data-input:pl-(--edge-to-text)",
			],
			inputGroupAddon: [
				"flex cursor-text select-none items-center justify-center gap-(--addon-gap)",
				"text-fg-muted *:[svg]:not-with-[size]:size-(--icon-size)",
				"group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start",
				"**:data-button:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
				"group-has-data-textarea/input-group:px-(--edge-to-text)",
				"group-has-data-textarea/input-group:last:pb-(--edge-to-text) group-has-data-textarea/input-group:first:pt-(--edge-to-text)",
				"group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)",
				"group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text)",
				"group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text)",
				"group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)",
			],
			input: [
				"inline-flex w-full cursor-text items-center outline-none",
				"h-(--input-h) in-data-input-group:h-auto",
				"disabled:cursor-disabled disabled:text-fg-disabled",
			],
			textArea: [
				"min-h-16 w-full resize-none py-(--top-to-text) outline-none",
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
	density: {
		compact: {
			slots: {
				inputGroup: compactText,
				input: compactText,
				textArea: compactText,
			},
			variants: {
				size: {
					sm: {
						inputGroup: tokens({ h: 6 }),
						input: tokens({ h: 6 }),
						textArea: tokens({ h: 6 }),
					},
					md: {
						inputGroup: tokens({ h: 7 }),
						input: tokens({ h: 7 }),
						textArea: tokens({ h: 7 }),
					},
					lg: {
						inputGroup: tokens({ h: 8 }),
						input: tokens({ h: 8 }),
						textArea: tokens({ h: 8 }),
					},
				},
			},
		},
		default: {
			slots: {
				inputGroup: defaultText,
				input: defaultText,
				textArea: defaultText,
			},
			variants: {
				size: {
					sm: {
						inputGroup: tokens({ h: 7 }),
						input: tokens({ h: 7 }),
						textArea: tokens({ h: 7 }),
					},
					md: {
						inputGroup: tokens({ h: 8 }),
						input: tokens({ h: 8 }),
						textArea: tokens({ h: 8 }),
					},
					lg: {
						inputGroup: tokens({ h: 9 }),
						input: tokens({ h: 9 }),
						textArea: tokens({ h: 9 }),
					},
				},
			},
		},
		comfortable: {
			slots: {
				inputGroup: defaultText,
				input: defaultText,
				textArea: defaultText,
			},
			variants: {
				size: {
					sm: {
						inputGroup: tokens({ h: 8 }),
						input: tokens({ h: 8 }),
						textArea: tokens({ h: 8 }),
					},
					md: {
						inputGroup: tokens({ h: 9 }),
						input: tokens({ h: 9 }),
						textArea: tokens({ h: 9 }),
					},
					lg: {
						inputGroup: tokens({ h: 10 }),
						input: tokens({ h: 10 }),
						textArea: tokens({ h: 10 }),
					},
				},
			},
		},
	},
	params: {
		style: {
			outline: {
				slots: {
					inputGroup: outlineField({ focus: "group" }),
					input: outlineField({ focus: "self" }),
					textArea: outlineField({ focus: "self" }),
					inputGroupAddon: addonInputModeParadigmB,
				},
			},
			line: {
				slots: {
					inputGroup: lineField({ focus: "group" }),
					input: lineField({ focus: "self" }),
					textArea: lineField({ focus: "self" }),
					inputGroupAddon: addonInputModeLine,
				},
			},
			"filled-line-bottom": {
				slots: {
					inputGroup: filledLineBottomField({ focus: "group" }),
					input: filledLineBottomField({ focus: "self" }),
					textArea: filledLineBottomField({ focus: "self" }),
					inputGroupAddon: addonInputModeParadigmB,
				},
			},
			filled: {
				slots: {
					inputGroup: filledField({ focus: "group" }),
					input: filledField({ focus: "self" }),
					textArea: filledField({ focus: "self" }),
					inputGroupAddon: addonInputModeParadigmB,
				},
			},
		},
	},
});

export type InputStyles = typeof styles;

export { useStyles };
