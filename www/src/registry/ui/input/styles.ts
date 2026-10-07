import { tv } from "tailwind-variants"

import { createStyles } from "@/lib/styles"

import inputMeta from "./meta"

/* -------------------------------- Tokens -------------------------------- */

// Per-height token sets (tuned from shadcn mira/nova/vega; 6, 10 and up
// extrapolated, 14 matching Material 3's 56dp field).
const tokens = tv({
  variants: {
    h: {
      6: "[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3)] [--input-h:--spacing(6)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
      7: "[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3.5)] [--input-h:--spacing(7)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
      8: "[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(8)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
      9: "[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(9)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
      10: "[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(3)] [--edge-to-visual:--spacing(2.5)] [--icon-size:--spacing(4.5)] [--input-h:--spacing(10)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]",
      11: "[--addon-button-inset:--spacing(2)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(3)] [--edge-to-visual:--spacing(2.5)] [--icon-size:--spacing(4.5)] [--input-h:--spacing(11)] [--text-to-visual:--spacing(2)] [--top-to-text:--spacing(2.5)]",
      12: "[--addon-button-inset:--spacing(2)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(3.5)] [--edge-to-visual:--spacing(3)] [--icon-size:--spacing(5)] [--input-h:--spacing(12)] [--text-to-visual:--spacing(2)] [--top-to-text:--spacing(3)]",
      13: "[--addon-button-inset:--spacing(2.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(3.5)] [--edge-to-visual:--spacing(3)] [--icon-size:--spacing(5)] [--input-h:--spacing(13)] [--text-to-visual:--spacing(2)] [--top-to-text:--spacing(3.5)]",
      14: "[--addon-button-inset:--spacing(2.5)] [--addon-gap:--spacing(2.5)] [--edge-to-text:--spacing(4)] [--edge-to-visual:--spacing(3)] [--icon-size:--spacing(6)] [--input-h:--spacing(14)] [--text-to-visual:--spacing(3)] [--top-to-text:--spacing(4)]",
      15: "[--addon-button-inset:--spacing(3)] [--addon-gap:--spacing(2.5)] [--edge-to-text:--spacing(4)] [--edge-to-visual:--spacing(3)] [--icon-size:--spacing(6)] [--input-h:--spacing(15)] [--text-to-visual:--spacing(3)] [--top-to-text:--spacing(4.5)]",
      16: "[--addon-button-inset:--spacing(3)] [--addon-gap:--spacing(3)] [--edge-to-text:--spacing(4)] [--edge-to-visual:--spacing(3.5)] [--icon-size:--spacing(6)] [--input-h:--spacing(16)] [--text-to-visual:--spacing(3)] [--top-to-text:--spacing(5)]",
      18: "[--addon-button-inset:--spacing(3.5)] [--addon-gap:--spacing(3)] [--edge-to-text:--spacing(4.5)] [--edge-to-visual:--spacing(4)] [--icon-size:--spacing(6)] [--input-h:--spacing(18)] [--text-to-visual:--spacing(3)] [--top-to-text:--spacing(6)]",
    },
  },
})

// One height rung on every slot that starts a field.
const h6 = {
  inputGroup: tokens({ h: 6 }),
  input: tokens({ h: 6 }),
  textArea: tokens({ h: 6 }),
  trigger: tokens({ h: 6 }),
}
const h7 = {
  inputGroup: tokens({ h: 7 }),
  input: tokens({ h: 7 }),
  textArea: tokens({ h: 7 }),
  trigger: tokens({ h: 7 }),
}
const h8 = {
  inputGroup: tokens({ h: 8 }),
  input: tokens({ h: 8 }),
  textArea: tokens({ h: 8 }),
  trigger: tokens({ h: 8 }),
}
const h9 = {
  inputGroup: tokens({ h: 9 }),
  input: tokens({ h: 9 }),
  textArea: tokens({ h: 9 }),
  trigger: tokens({ h: 9 }),
}
const h10 = {
  inputGroup: tokens({ h: 10 }),
  input: tokens({ h: 10 }),
  textArea: tokens({ h: 10 }),
  trigger: tokens({ h: 10 }),
}
const h12 = {
  inputGroup: tokens({ h: 12 }),
  input: tokens({ h: 12 }),
  textArea: tokens({ h: 12 }),
  trigger: tokens({ h: 12 }),
}
const h14 = {
  inputGroup: tokens({ h: 14 }),
  input: tokens({ h: 14 }),
  textArea: tokens({ h: 14 }),
  trigger: tokens({ h: 14 }),
}
// Past the control ladder, a Button select trigger takes the field height.
const taller7 = {
  inputGroup: tokens({ h: 7 }),
  input: tokens({ h: 7 }),
  textArea: tokens({ h: 7 }),
  trigger: tokens({ h: 7 }),
  buttonTrigger: [tokens({ h: 7 }), "h-(--input-h)"],
}
const taller8 = {
  inputGroup: tokens({ h: 8 }),
  input: tokens({ h: 8 }),
  textArea: tokens({ h: 8 }),
  trigger: tokens({ h: 8 }),
  buttonTrigger: [tokens({ h: 8 }), "h-(--input-h)"],
}
const taller9 = {
  inputGroup: tokens({ h: 9 }),
  input: tokens({ h: 9 }),
  textArea: tokens({ h: 9 }),
  trigger: tokens({ h: 9 }),
  buttonTrigger: [tokens({ h: 9 }), "h-(--input-h)"],
}
const taller10 = {
  inputGroup: tokens({ h: 10 }),
  input: tokens({ h: 10 }),
  textArea: tokens({ h: 10 }),
  trigger: tokens({ h: 10 }),
  buttonTrigger: [tokens({ h: 10 }), "h-(--input-h)"],
}
const taller11 = {
  inputGroup: tokens({ h: 11 }),
  input: tokens({ h: 11 }),
  textArea: tokens({ h: 11 }),
  trigger: tokens({ h: 11 }),
  buttonTrigger: [tokens({ h: 11 }), "h-(--input-h)"],
}
const taller12 = {
  inputGroup: tokens({ h: 12 }),
  input: tokens({ h: 12 }),
  textArea: tokens({ h: 12 }),
  trigger: tokens({ h: 12 }),
  buttonTrigger: [tokens({ h: 12 }), "h-(--input-h)"],
}
const taller13 = {
  inputGroup: tokens({ h: 13 }),
  input: tokens({ h: 13 }),
  textArea: tokens({ h: 13 }),
  trigger: tokens({ h: 13 }),
  buttonTrigger: [tokens({ h: 13 }), "h-(--input-h)"],
}
const taller14 = {
  inputGroup: tokens({ h: 14 }),
  input: tokens({ h: 14 }),
  textArea: tokens({ h: 14 }),
  trigger: tokens({ h: 14 }),
  buttonTrigger: [tokens({ h: 14 }), "h-(--input-h)"],
}

const taller15 = {
  inputGroup: tokens({ h: 15 }),
  input: tokens({ h: 15 }),
  textArea: tokens({ h: 15 }),
  trigger: tokens({ h: 15 }),
  buttonTrigger: [tokens({ h: 15 }), "h-(--input-h)"],
}
const taller16 = {
  inputGroup: tokens({ h: 16 }),
  input: tokens({ h: 16 }),
  textArea: tokens({ h: 16 }),
  trigger: tokens({ h: 16 }),
  buttonTrigger: [tokens({ h: 16 }), "h-(--input-h)"],
}
const taller18 = {
  inputGroup: tokens({ h: 18 }),
  input: tokens({ h: 18 }),
  textArea: tokens({ h: 18 }),
  trigger: tokens({ h: 18 }),
  buttonTrigger: [tokens({ h: 18 }), "h-(--input-h)"],
}

// 16px below sm, so iOS never zooms a focused field.
const compactText = "text-base sm:text-xs/relaxed"
const defaultText = "text-base sm:text-sm"
const largeText = "text-base"

// One text step on every slot that starts a field.
const compactFields = {
  inputGroup: compactText,
  input: compactText,
  textArea: compactText,
  trigger: compactText,
}
const defaultFields = {
  inputGroup: defaultText,
  input: defaultText,
  textArea: defaultText,
  trigger: defaultText,
}
const largeFields = {
  inputGroup: largeText,
  input: largeText,
  textArea: largeText,
  trigger: largeText,
}

/* ----------------------------- Field shells ----------------------------- */

// `focus`: inputs react to their own `:focus`, a group to its focused
// control, a trigger (a button) to keyboard focus only. Unfocused, an
// invalid field wears the invalid halo instead.
const shellFocus = {
  self: "focus:focus-input focus:not-invalid:border-(--focus-input-border) invalid:not-focus:invalid-ring",
  group:
    "group-focus/combobox:focus-input group-focus/combobox:not-invalid:border-(--focus-input-border) has-[[data-input-control][data-focused]]:focus-input has-[[data-input-control][data-focused]]:not-invalid:border-(--focus-input-border) invalid:not-focus-within:invalid-ring",
  trigger:
    "focus-visible:focus-input focus-visible:not-invalid:border-(--focus-input-border) invalid:not-focus-visible:invalid-ring",
}

const shellRadius = {
  single: "rounded-(--studio-input-radius)",
  multiline: "rounded-(--studio-input-multiline-radius)",
  group:
    "not-has-data-textarea:rounded-(--studio-input-radius) has-data-textarea:rounded-(--studio-input-multiline-radius)",
}

const boxed =
  "border-(length:--studio-control-stroke) px-(--edge-to-text) transition-[box-shadow,border-color,background-color,color] duration-(--studio-input-state-duration) ease-(--studio-input-state-ease) invalid:border-border-danger invalid:invalid-fill invalid:ring-(color:--focus-invalid-color) disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-field))"

// shadcn nova: a clear box on the control edge, tinted in dark.
const outlineShell = tv({
  base: [
    boxed,
    "border-border-control bg-transparent dark:bg-border-control/30",
  ],
  variants: { focus: shellFocus, radius: shellRadius },
  defaultVariants: { radius: "single" },
})

// Untitled UI: a page-white box on the control edge with an xs drop.
const raisedShell = tv({
  base: [boxed, "border-border-control bg-bg shadow-xs"],
  variants: { focus: shellFocus, radius: shellRadius },
  defaultVariants: { radius: "single" },
})

// GitHub Primer: a page-white box on the control edge, recessed by a 1px
// inner top shadow.
const insetShell = tv({
  base: [
    boxed,
    "border-border-control bg-bg shadow-[inset_0_1px_0_0_rgb(31_35_40/0.04)] dark:shadow-[inset_0_1px_0_0_rgb(1_4_9/0.24)]",
  ],
  variants: { focus: shellFocus, radius: shellRadius },
  defaultVariants: { radius: "single" },
})

// shadcn mira, Supabase: the field well on the control edge.
const wellShell = tv({
  base: [boxed, "border-border-control bg-field"],
  variants: { focus: shellFocus, radius: shellRadius },
  defaultVariants: { radius: "single" },
})

// shadcn luma: the field well with no visible edge.
const filledShell = tv({
  base: [boxed, "border-transparent bg-field"],
  variants: { focus: shellFocus, radius: shellRadius },
  defaultVariants: { radius: "single" },
})

// Material 3 filled, Carbon: the well over a bottom indicator. It ends in a
// straight rule, so only its top corners round, and small. A ring or halo
// goes around the box (Carbon); a border focus thickens the rule (M3).
const indicatorShell = tv({
  base: "rounded-t-(--studio-radius-detail) border-b-(length:--studio-control-stroke) border-border-control bg-field px-(--edge-to-text) transition-[box-shadow,border-color,background-color,color] duration-(--studio-input-state-duration) ease-(--studio-input-state-ease) invalid:border-border-danger invalid:invalid-fill invalid:ring-(color:--focus-invalid-color) disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-field))",
  variants: {
    focus: {
      self: "invalid:not-focus:invalid-ring focus:focus-input-indicator focus:not-invalid:border-(--focus-input-border)",
      group:
        "group-focus/combobox:focus-input-indicator group-focus/combobox:not-invalid:border-(--focus-input-border) invalid:not-focus-within:invalid-ring has-[[data-input-control][data-focused]]:focus-input-indicator has-[[data-input-control][data-focused]]:not-invalid:border-(--focus-input-border)",
      trigger:
        "invalid:not-focus-visible:invalid-ring focus-visible:focus-input-indicator focus-visible:not-invalid:border-(--focus-input-border)",
    },
  },
})

// shadcn sera: a bottom rule only, no fill, no inline padding, no corners.
// Every focus and invalid layer draws under the rule.
const underlineShell = tv({
  base: "border-b-(length:--studio-control-stroke) border-border-control transition-[box-shadow,border-color,color] duration-(--studio-input-state-duration) ease-(--studio-input-state-ease) invalid:border-border-danger invalid:invalid-fill invalid:ring-(color:--focus-invalid-color) disabled:border-(--disabled-border,var(--color-border-control))",
  variants: {
    focus: {
      self: "invalid:not-focus:invalid-ring-underline focus:focus-input-underline focus:not-invalid:border-(--focus-input-border) invalid:focus:border-fg-danger",
      group:
        "group-focus/combobox:focus-input-underline group-focus/combobox:not-invalid:border-(--focus-input-border) invalid:not-focus-within:invalid-ring-underline invalid:group-focus/combobox:border-fg-danger has-[[data-input-control][data-focused]]:focus-input-underline has-[[data-input-control][data-focused]]:not-invalid:border-(--focus-input-border) invalid:has-[[data-input-control][data-focused]]:border-fg-danger",
      trigger:
        "invalid:not-focus-visible:invalid-ring-underline focus-visible:focus-input-underline focus-visible:not-invalid:border-(--focus-input-border) invalid:focus-visible:border-fg-danger",
    },
  },
})

// The caret sits at the visual inset, after the shell's padding.
const triggerEnd = "pr-(--edge-to-visual)"

/* ----------------------------- Addon helpers ----------------------------- */

// The color of a divider between shell parts (stepper cells): the shell's
// edge, or nothing on shells without a side edge.
const edgeDivider = "border-border-control"
const noDivider = "border-transparent"

// The fill of a segment inside the shell (stacked inset steppers): Polaris's
// tertiary fill, or the page on shells already filled with the field well.
const neutralChip = "bg-neutral"
const pageChip = "bg-bg"

// Boxed shells: the addon owns asymmetric inline padding.
const addonBoxedShell =
  "group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)] group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-var(--studio-control-stroke))] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-var(--studio-control-stroke))]"

// Underline: symmetric inline padding (no fill or side edge to yield to).
const addonUnderline =
  "group-has-data-input/input-group:last:pl-(--text-to-visual) group-has-data-input/input-group:first:pr-(--text-to-visual)"

/* A cell addon (Bootstrap input-group, Ant addonBefore, Geist prefix): a
   tinted cell hugging the shell, divided by the shell's own edge. Shells
   without a side edge (Underline, Filled, Indicator) keep it inline. */
const addonCell = [
  "self-stretch bg-highlight group-has-data-input/input-group:first:mr-(--edge-to-text) group-has-data-input/input-group:first:rounded-l-[inherit] group-has-data-input/input-group:last:ml-(--edge-to-text) group-has-data-input/input-group:last:rounded-r-[inherit] group-has-data-textarea/input-group:first:rounded-t-[inherit] group-has-data-textarea/input-group:first:pb-(--edge-to-text) group-has-data-textarea/input-group:last:rounded-b-[inherit] group-has-data-textarea/input-group:last:pt-(--edge-to-text) group-has-data-textarea/input-group:has-data-button:first:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:pt-(--top-to-text)",
  edgeDivider,
  "group-has-data-input/input-group:first:border-r-(length:--studio-control-stroke) group-has-data-input/input-group:last:border-l-(length:--studio-control-stroke) group-has-data-textarea/input-group:first:border-b-(length:--studio-control-stroke) group-has-data-textarea/input-group:last:border-t-(length:--studio-control-stroke)",
]

/* --------------------------------- Hover --------------------------------- */

// The field's own pointer state: it yields to invalid, disabled and the
// focus its slot shows (RAC marks focus-within on groups only).
const groupEdge =
  "hover:not-focus-within:not-invalid:not-disabled:border-border-control-hover"
const selfEdge =
  "hover:not-focus:not-invalid:not-disabled:border-border-control-hover"
const triggerEdge =
  "hover:not-focus-visible:not-invalid:not-disabled:border-border-control-hover"
const groupTint = "hover:not-focus-within:not-disabled:bg-neutral-hover"
const selfTint = "hover:not-focus:not-disabled:bg-neutral-hover"
const triggerTint = "hover:not-focus-visible:not-disabled:bg-neutral-hover"

/* An error icon drawn inside the control (Carbon, Material 3): a danger disc
   with an exclamation, painted as background layers over the invalid fill
   (base.css invalid-fill) so a bare <input> can carry it. */
const errorIconInside =
  "invalid:[--invalid-icon:linear-gradient(var(--color-fg-on-danger),var(--color-fg-on-danger)),linear-gradient(var(--color-fg-on-danger),var(--color-fg-on-danger)),radial-gradient(circle_closest-side,var(--color-danger)_calc(100%-0.5px),transparent)] invalid:bg-size-[calc(var(--icon-size)/8)_calc(var(--icon-size)*3/8),calc(var(--icon-size)/8)_calc(var(--icon-size)/8),var(--icon-size)_var(--icon-size),100%_100%] invalid:bg-position-[right_calc(var(--edge-to-text)+var(--icon-size)*7/16)_top_calc(50%-var(--icon-size)/16),right_calc(var(--edge-to-text)+var(--icon-size)*7/16)_top_calc(50%+var(--icon-size)/4),right_var(--edge-to-text)_center,0_0] invalid:bg-no-repeat invalid:pr-[calc(var(--edge-to-text)+var(--icon-size)+var(--text-to-visual))]"

/* ----------------------------- Recipe table ----------------------------- */

/** Every shell, one per Inputs › Style. Each slice dresses every field slot,
 *  so text fields, groups, text areas and select triggers move together. */
export const FIELD_SHELLS = {
  outline: {
    slots: {
      inputGroup: outlineShell({ focus: "group", radius: "group" }),
      input: outlineShell({ focus: "self" }),
      textArea: outlineShell({ focus: "self", radius: "multiline" }),
      trigger: [outlineShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonBoxedShell,
      divider: edgeDivider,
      chip: neutralChip,
    },
    variants: { variant: { cell: { inputGroupAddon: addonCell } } },
  },
  raised: {
    slots: {
      inputGroup: raisedShell({ focus: "group", radius: "group" }),
      input: raisedShell({ focus: "self" }),
      textArea: raisedShell({ focus: "self", radius: "multiline" }),
      trigger: [raisedShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonBoxedShell,
      divider: edgeDivider,
      chip: neutralChip,
    },
    variants: { variant: { cell: { inputGroupAddon: addonCell } } },
  },
  inset: {
    slots: {
      inputGroup: insetShell({ focus: "group", radius: "group" }),
      input: insetShell({ focus: "self" }),
      textArea: insetShell({ focus: "self", radius: "multiline" }),
      trigger: [insetShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonBoxedShell,
      divider: edgeDivider,
      chip: neutralChip,
    },
    variants: { variant: { cell: { inputGroupAddon: addonCell } } },
  },
  well: {
    slots: {
      inputGroup: wellShell({ focus: "group", radius: "group" }),
      input: wellShell({ focus: "self" }),
      textArea: wellShell({ focus: "self", radius: "multiline" }),
      trigger: [wellShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonBoxedShell,
      divider: edgeDivider,
      chip: pageChip,
    },
    variants: { variant: { cell: { inputGroupAddon: addonCell } } },
  },
  filled: {
    slots: {
      inputGroup: filledShell({ focus: "group", radius: "group" }),
      input: filledShell({ focus: "self" }),
      textArea: filledShell({ focus: "self", radius: "multiline" }),
      trigger: [filledShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonBoxedShell,
      divider: noDivider,
      chip: pageChip,
    },
  },
  indicator: {
    slots: {
      inputGroup: indicatorShell({ focus: "group" }),
      input: indicatorShell({ focus: "self" }),
      textArea: indicatorShell({ focus: "self" }),
      trigger: [indicatorShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonBoxedShell,
      divider: noDivider,
      chip: pageChip,
    },
  },
  underline: {
    slots: {
      inputGroup: underlineShell({ focus: "group" }),
      input: underlineShell({ focus: "self" }),
      textArea: underlineShell({ focus: "self" }),
      trigger: [underlineShell({ focus: "trigger" }), triggerEnd],
      inputGroupAddon: addonUnderline,
      divider: noDivider,
      chip: neutralChip,
    },
  },
}

/* -------------------------------------------------------------------------- */

const { useStyles, styles } = createStyles(inputMeta, {
  base: {
    slots: {
      inputGroup: [
        "group/input-group relative flex h-(--input-h) w-full min-w-0 cursor-text items-center",
        // The inner control sheds its shell; `!` outranks the shell's state
        // and dark fills, which out-specify a plain descendant reset.
        "**:data-input-control:flex-1 **:data-input-control:rounded-none **:data-input-control:border-0 **:data-input-control:bg-transparent! **:data-input-control:bg-none! **:data-input-control:shadow-none! **:data-input-control:ring-0!",
        // Range compositions (start input, separator, end input): only the last
        // control keeps flex-1, so the slack sits before the trailing addon
        // instead of before the separator (React Aria: `[slot=end] { flex: 1 }`).
        "**:data-input-control:has-[~[data-input-control]]:w-auto **:data-input-control:has-[~[data-input-control]]:flex-none",
        "**:data-date-input:px-0 **:data-input:px-0",
        "has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full",
        "has-data-input:has-[[data-input-group-addon]:first-child]:pl-0 has-data-input:has-[[data-input-group-addon]:last-child]:pr-0",
        "has-data-textarea:px-0",
        "disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor)",
        "has-data-combobox-value:h-auto has-data-combobox-value:min-h-(--input-h) has-data-combobox-value:flex-wrap has-data-combobox-value:items-center has-data-combobox-value:gap-1 has-data-combobox-value:py-(--addon-button-inset) has-data-combobox-value:pl-(--addon-button-inset) **:data-combobox-value:contents has-data-combobox-value:has-[[data-tag-list][data-empty]]:**:data-input:pl-(--edge-to-text) **:data-tag:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] **:data-tag-group:contents **:data-tag-list:contents",
      ],
      inputGroupAddon: [
        "flex cursor-text items-center justify-center gap-(--addon-gap) select-none",
        "text-fg-muted *:[svg]:not-with-[size]:size-(--icon-size)",
        "group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start",
        "**:data-button:rounded-[max(min(var(--radius-sm),var(--studio-input-radius)),calc(var(--studio-input-radius)-(var(--addon-button-inset)-var(--studio-control-stroke))))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]",
        "group-has-data-textarea/input-group:px-(--edge-to-text)",
        "group-has-data-textarea/input-group:first:pt-(--edge-to-text) group-has-data-textarea/input-group:last:pb-(--edge-to-text)",
        "group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)",
        "group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text)",
        "group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text)",
        "group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)",
      ],
      input: [
        "inline-flex w-full cursor-text items-center outline-none",
        "h-(--input-h) in-data-input-group:h-auto",
        "disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor)",
      ],
      textArea: [
        "min-h-16 w-full resize-none py-(--top-to-text) outline-none",
        "disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor)",
      ],
      // A select trigger worn as a field (Inputs › Select trigger: Field).
      trigger: [
        "inline-flex h-(--input-h) w-full cursor-interactive items-center gap-(--text-to-visual) text-left whitespace-nowrap outline-none select-none",
        "*:[svg]:pointer-events-none *:[svg]:size-(--icon-size) *:[svg]:shrink-0 *:[svg]:text-fg-muted",
        "disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor)",
      ],
      // A select trigger drawn by Button: it only borrows the field height.
      buttonTrigger: "",
      divider: "",
      chip: "",
      dateInputSegment:
        "rounded-(--studio-radius-detail) px-0.5 outline-hidden select-none placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-(--disabled-fg,currentColor) type-literal:px-0",
    },
    variants: {
      size: {
        sm: {},
        md: {},
        lg: {},
      },
      variant: {
        inline: {},
        cell: {},
      },
    },
    defaultVariants: {
      size: "md",
      variant: "inline",
    },
  },
  params: {
    style: FIELD_SHELLS,
    // The value text: the density's control rung, or one above it (Untitled
    // UI, Material 3: 16px fields beside 14px controls).
    text: {
      same: {
        density: {
          compact: { slots: compactFields },
          default: { slots: defaultFields },
          comfortable: { slots: defaultFields },
          spacious: { slots: defaultFields },
          touch: { slots: largeFields },
        },
      },
      large: {
        density: {
          compact: { slots: defaultFields },
          default: { slots: largeFields },
          comfortable: { slots: largeFields },
          spacious: { slots: largeFields },
          touch: { slots: largeFields },
        },
      },
    },
    hover: {
      none: {},
      edge: {
        slots: {
          inputGroup: groupEdge,
          input: selfEdge,
          textArea: selfEdge,
          trigger: triggerEdge,
        },
      },
      tint: {
        slots: {
          inputGroup: groupTint,
          input: selfTint,
          textArea: selfTint,
          trigger: triggerTint,
        },
      },
      "edge-tint": {
        slots: {
          inputGroup: [groupEdge, groupTint],
          input: [selfEdge, selfTint],
          textArea: [selfEdge, selfTint],
          trigger: [triggerEdge, triggerTint],
        },
      },
    },
    // The size tokens per density: the control ladder, one rung (4px) above
    // it, or four (16px).
    height: {
      controls: {
        density: {
          compact: { variants: { size: { sm: h6, md: h7, lg: h8 } } },
          default: { variants: { size: { sm: h7, md: h8, lg: h9 } } },
          comfortable: { variants: { size: { sm: h8, md: h9, lg: h10 } } },
          spacious: { variants: { size: { sm: h8, md: h10, lg: h12 } } },
          touch: { variants: { size: { sm: h8, md: h12, lg: h14 } } },
        },
      },
      step: {
        density: {
          compact: {
            variants: { size: { sm: taller7, md: taller8, lg: taller9 } },
          },
          default: {
            variants: { size: { sm: taller8, md: taller9, lg: taller10 } },
          },
          comfortable: {
            variants: { size: { sm: taller9, md: taller10, lg: taller11 } },
          },
          spacious: {
            variants: { size: { sm: taller9, md: taller11, lg: taller13 } },
          },
          touch: {
            variants: { size: { sm: taller9, md: taller13, lg: taller15 } },
          },
        },
      },
      tall: {
        density: {
          compact: {
            variants: { size: { sm: taller10, md: taller11, lg: taller12 } },
          },
          default: {
            variants: { size: { sm: taller11, md: taller12, lg: taller13 } },
          },
          comfortable: {
            variants: { size: { sm: taller12, md: taller13, lg: taller14 } },
          },
          spacious: {
            variants: { size: { sm: taller12, md: taller14, lg: taller16 } },
          },
          touch: {
            variants: { size: { sm: taller12, md: taller16, lg: taller18 } },
          },
        },
      },
    },
    errorIcon: {
      none: {},
      inside: {
        slots: { input: errorIconInside, textArea: errorIconInside },
      },
    },
  },
})

export type InputStyles = typeof styles

export { styles as inputStyles, useStyles }
