import { InternalRegistry, InternalRegistryItem } from "@dotui/schemas";

export const core: InternalRegistry = [
  {
    name: "alert",
    variants: ["basic", "notch", "notch-2"],
  },
  {
    name: "alert_basic",
    description: "Minimal with a subtle border and muted background.",
    files: [
      {
        type: "core",
        source: "core/alert_basic.tsx",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "alert_notch",
    description: "Alert with a bold left border for emphasis.",
    files: [
      {
        type: "core",
        source: "core/alert_notch.tsx",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "alert_notch-2",
    description:
      "Alert with a bold left border for emphasis and muted background.",
    files: [
      {
        type: "core",
        source: "core/alert_notch.tsx",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "avatar",
    files: [
      {
        type: "core",
        source: "core/avatar_basic.tsx",
        target: "core/avatar.tsx",
      },
    ],
  },
  {
    name: "badge",
    files: [
      {
        type: "core",
        source: "core/badge_basic.tsx",
        target: "core/badge.tsx",
      },
    ],
  },
  {
    name: "breadcrumbs",
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/breadcrumbs_basic.tsx",
        target: "core/breadcrumbs.tsx",
      },
    ],
  },
  {
    name: "button",
    variants: ["basic", "brutalist", "ripple"],
  },
  {
    name: "button_basic",
    registryDeps: ["loader", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/button_basic.tsx",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "button_brutalist",
    registryDeps: ["loader", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/button_brutalist.tsx",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "button_ripple",
    registryDeps: ["loader", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/button_ripple.tsx",
        target: "core/button.tsx",
      },
      {
        type: "core",
        source: "core/ripple.tsx",
        target: "core/ripple.tsx",
      },
      {
        type: "hook",
        source: "hooks/use-ripple.ts",
        target: "hooks/use-ripple.ts",
      },
    ],
  },
  {
    name: "calendar",
    variants: ["basic", "cal"],
  },
  {
    name: "calendar_basic",
    registryDeps: ["button", "text", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/calendar_basic.tsx",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "calendar_cal",
    registryDeps: ["button", "text", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/calendar_cal.tsx",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "checkbox",
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/checkbox_basic.tsx",
        target: "core/checkbox.tsx",
      },
    ],
  },
  {
    name: "checkbox-group",
    registryDeps: ["field", "checkbox"],
    files: [
      {
        type: "core",
        source: "core/checkbox-group_basic.tsx",
        target: "core/checkbox-group.tsx",
      },
    ],
  },
  {
    name: "color-area",
    registryDeps: ["color-thumb"],
    files: [
      {
        type: "core",
        source: "core/color-area_basic.tsx",
        target: "core/color-area.tsx",
      },
    ],
  },
  {
    name: "color-field",
    registryDeps: ["field", "input"],
    files: [
      {
        type: "core",
        source: "core/color-field_basic.tsx",
        target: "core/color-field.tsx",
      },
    ],
  },
  {
    name: "color-picker",
    registryDeps: [
      "button",
      "color-area",
      "color-field",
      "color-slider",
      "color-swatch",
      "dialog",
      "select",
    ],
    files: [
      {
        type: "core",
        source: "core/color-picker_basic.tsx",
        target: "core/color-picker.tsx",
      },
    ],
  },
  {
    name: "color-slider",
    registryDeps: ["field", "color-thum"],
    files: [
      {
        type: "core",
        source: "core/color-slider_basic.tsx",
        target: "core/color-slider.tsx",
      },
    ],
  },
  {
    name: "color-swatch",
    files: [
      {
        type: "core",
        source: "core/color-swatch_basic.tsx",
        target: "core/color-swatch.tsx",
      },
    ],
  },
  {
    name: "color-swatch-picker",
    registryDeps: ["focus-styles", "color-swatch"],
    files: [
      {
        type: "core",
        source: "core/color-swatch-picker_basic.tsx",
        target: "core/color-swatch-picker.tsx",
      },
    ],
  },
  {
    name: "color-thumb",
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/color-thumb_basic.tsx",
        target: "core/color-thumb.tsx",
      },
    ],
  },
  {
    name: "combobox",
    registryDeps: ["field", "button", "input", "list-box", "overlay"],
    files: [
      {
        type: "core",
        source: "core/combobox_basic.tsx",
        target: "core/combobox.tsx",
      },
    ],
  },
  {
    name: "command",
    files: [
      {
        type: "core",
        source: "core/command_basic.tsx",
        target: "core/command.tsx",
      },
    ],
  },
  {
    name: "date-field",
    registryDeps: ["field", "input", "date-input"],
    files: [
      {
        type: "core",
        source: "core/date-field_basic.tsx",
        target: "core/date-field.tsx",
      },
    ],
  },
  {
    name: "date-input",
    files: [
      {
        type: "core",
        source: "core/date-input_basic.tsx",
        target: "core/date-input.tsx",
      },
    ],
  },
  {
    name: "date-picker",
    registryDeps: [
      "button",
      "calendar",
      "field",
      "input",
      "date-input",
      "dialog",
    ],
    files: [
      {
        type: "core",
        source: "core/date-picker_basic.tsx",
        target: "core/date-picker.tsx",
      },
    ],
  },
  {
    name: "date-range-picker",
    registryDeps: [
      "button",
      "calendar",
      "field",
      "input",
      "date-input",
      "dialog",
    ],
    files: [
      {
        type: "core",
        source: "core/date-range-picker_basic.tsx",
        target: "core/date-range-picker.tsx",
      },
    ],
  },
  {
    name: "dialog",
    registryDeps: ["overlay"],
    files: [
      {
        type: "core",
        source: "core/dialog_basic.tsx",
        target: "core/dialog.tsx",
      },
    ],
  },
  {
    name: "drawer",
    files: [
      {
        type: "core",
        source: "core/drawer_basic.tsx",
        target: "core/drawer.tsx",
      },
    ],
  },
  {
    name: "drop-zone",
    files: [
      {
        type: "core",
        source: "core/drop-zone_basic.tsx",
        target: "core/drop-zone.tsx",
      },
    ],
  },
  {
    name: "field",
    files: [
      {
        type: "core",
        source: "core/field_basic.tsx",
        target: "core/field.tsx",
      },
    ],
  },
  {
    name: "file-trigger",
    files: [
      {
        type: "core",
        source: "core/file-trigger_basic.tsx",
        target: "core/file-trigger.tsx",
      },
    ],
  },
  {
    name: "form",
    variants: ["basic", "react-hook-form"],
  },
  {
    name: "form_basic",
    files: [
      {
        type: "core",
        source: "core/form_basic.tsx",
        target: "core/form.tsx",
      },
    ],
  },
  {
    name: "form_react-hook-form",
    deps: ["react-hook-form"],
    files: [
      {
        type: "core",
        source: "core/form_react-hook-form.tsx",
        target: "core/form.tsx",
      },
    ],
  },
  {
    name: "input",
    variants: ["basic"],
  },
  {
    name: "input_basic",
    deps: ["@react-aria/utils", "@react-stately/utils"],
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/input_basic.tsx",
        target: "core/input.tsx",
      },
    ],
  },
  {
    name: "kbd",
    files: [
      {
        type: "core",
        source: "core/kbd_basic.tsx",
        target: "core/kbd.tsx",
      },
    ],
  },
  {
    name: "list-box",
    registryDeps: ["text", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/list-box_basic.tsx",
        target: "core/list-box.tsx",
      },
    ],
  },
  {
    name: "loader",
    variants: ["dots", "line", "ring", "tailspin", "wave"],
  },
  {
    name: "loader_dots",
    files: [
      {
        type: "core",
        source: "core/loader_dots.tsx",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_line",
    files: [
      {
        type: "core",
        source: "core/loader_line.tsx",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_ring",
    files: [
      {
        type: "core",
        source: "core/loader_ring.tsx",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_tailspin",
    files: [
      {
        type: "core",
        source: "core/loader_tailspin.tsx",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_wave",
    deps: ["motion"],
    files: [
      {
        type: "core",
        source: "core/loader_wave.tsx",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "menu",
    registryDeps: ["kbd", "overlay", "text"],
    files: [
      {
        type: "core",
        source: "core/menu_basic.tsx",
        target: "core/menu.tsx",
      },
    ],
  },
  {
    name: "modal",
    files: [
      {
        type: "core",
        source: "core/modal_basic.tsx",
        target: "core/modal.tsx",
      },
    ],
  },
  {
    name: "number-field",
    registryDeps: ["input", "field", "use-is-mobile"],
    files: [
      {
        type: "core",
        source: "core/number-field_basic.tsx",
        target: "core/number-field.tsx",
      },
    ],
  },
  {
    name: "overlay",
    registryDeps: ["modal", "popover", "drawer", "use-is-mobile"],
    files: [
      {
        type: "core",
        source: "core/overlay_basic.tsx",
        target: "core/overlay.tsx",
      },
    ],
  },
  {
    name: "popover",
    files: [
      {
        type: "core",
        source: "core/popover_basic.tsx",
        target: "core/popover.tsx",
      },
    ],
  },
  {
    name: "progress-bar",
    registryDeps: ["field"],
    files: [
      {
        type: "core",
        source: "core/progress-bar_basic.tsx",
        target: "core/progress-bar.tsx",
      },
    ],
  },
  {
    name: "radio-group",
    registryDeps: ["focus-styles", "field"],
    files: [
      {
        type: "core",
        source: "core/radio-group_basic.tsx",
        target: "core/radio-group.tsx",
      },
    ],
  },
  {
    name: "search-field",
    registryDeps: ["field", "button"],
    files: [
      {
        type: "core",
        source: "core/search-field_basic.tsx",
        target: "core/search-field.tsx",
      },
    ],
  },
  {
    name: "select",
    registryDeps: ["button", "field", "list-box", "popover"],
    files: [
      {
        type: "core",
        source: "core/select_basic.tsx",
        target: "core/select.tsx",
      },
    ],
  },
  {
    name: "separator",
    files: [
      {
        type: "core",
        source: "core/separator_basic.tsx",
        target: "core/separator.tsx",
      },
    ],
  },
  {
    name: "skeleton",
    files: [
      {
        type: "core",
        source: "core/skeleton_basic.tsx",
        target: "core/skeleton.tsx",
      },
    ],
  },
  {
    name: "slider",
    deps: ["@react-aria/utils"],
    registryDeps: ["field", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/slider_basic.tsx",
        target: "core/slider.tsx",
      },
    ],
  },
  {
    name: "switch",
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/switch_basic.tsx",
        target: "core/switch.tsx",
      },
    ],
  },
  {
    name: "table",
    registryDeps: ["checkbox", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/table_basic.tsx",
        target: "core/table.tsx",
      },
    ],
  },
  {
    name: "tabs",
    variants: ["basic", "motion"],
  },
  {
    name: "tabs_basic",
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/tabs_basic.tsx",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "tabs_motion",
    deps: ["motion"],
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/tabs_motion.tsx",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "tag-group",
    registryDeps: ["field", "button", "focus-styles"],
    files: [
      {
        type: "core",
        source: "core/tag-group_basic.tsx",
        target: "core/tag-group.tsx",
      },
    ],
  },
  {
    name: "text",
    files: [
      {
        type: "core",
        source: "core/text_basic.tsx",
        target: "core/text.tsx",
      },
    ],
  },
  {
    name: "text-area",
    registryDeps: ["field", "input"],
    files: [
      {
        type: "core",
        source: "core/text-area_basic.tsx",
        target: "core/text-area.tsx",
      },
    ],
  },
  {
    name: "text-field",
    registryDeps: ["field", "input"],
    files: [
      {
        type: "core",
        source: "core/text-field_basic.tsx",
        target: "core/text-field.tsx",
      },
    ],
  },
  {
    name: "time-field",
    registryDeps: ["field", "input", "date-input"],
    files: [
      {
        type: "core",
        source: "core/time-field_basic.tsx",
        target: "core/time-field.tsx",
      },
    ],
  },
  {
    name: "toggle-button",
    registryDeps: ["focus-styles"],
    files: [
      {
        type: "core",
        source: "core/toggle-button_basic.tsx",
        target: "core/toggle-button.tsx",
      },
    ],
  },
  {
    name: "toggle-button-group",
    registryDeps: ["toggle-button"],
    files: [
      {
        type: "core",
        source: "core/toggle-button-group_basic.tsx",
        target: "core/toggle-button-group.tsx",
      },
    ],
  },
  {
    name: "tooltip",
    variants: ["basic", "motion"],
  },
  {
    name: "tooltip_basic",
    files: [
      {
        type: "core",
        source: "core/tooltip_basic.tsx",
        target: "core/tooltip.tsx",
      },
    ],
  },
  {
    name: "tooltip_motion",
    deps: ["motion"],
    files: [
      {
        type: "core",
        source: "core/tooltip_motion.tsx",
        target: "core/tooltip.tsx",
      },
    ],
  },
].map(
  ({ name, ...rest }) =>
    ({ name, type: "core", ...rest }) as InternalRegistryItem
);
