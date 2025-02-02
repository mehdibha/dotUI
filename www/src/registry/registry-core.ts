import type { Registry } from "./types";

export const core: Registry = [
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
        path: "core/alert_basic.tsx",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "alert_notch",
    description: "Alert with a bold left border for emphasis.",
    files: [
      {
        path: "core/alert_notch.tsx",
        type: "core",
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
        path: "core/alert_notch.tsx",
        type: "core",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "avatar",
    files: [
      {
        path: "core/avatar_basic.tsx",
        type: "core",
        target: "core/avatar.tsx",
      },
    ],
  },
  {
    name: "badge",
    files: [
      {
        path: "core/badge_basic.tsx",
        type: "core",
        target: "core/badge.tsx",
      },
    ],
  },
  {
    name: "breadcrumbs",
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/breadcrumbs_basic.tsx",
        type: "core",
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
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        path: "core/button_basic.tsx",
        type: "core",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "button_brutalist",
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        path: "core/button_brutalist.tsx",
        type: "core",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "button_ripple",
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        path: "core/button_ripple.tsx",
        type: "core",
        target: "core/button.tsx",
      },
      {
        path: "core/ripple.tsx",
        type: "core",
        target: "core/ripple.tsx",
      },
      {
        path: "hooks/use-ripple.ts",
        type: "hook",
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
    registryDependencies: ["button", "text", "focus-styles"],
    files: [
      {
        path: "core/calendar_basic.tsx",
        type: "core",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "calendar_cal",
    registryDependencies: ["button", "text", "focus-styles"],
    files: [
      {
        path: "core/calendar_cal.tsx",
        type: "core",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "checkbox",
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/checkbox_basic.tsx",
        type: "core",
        target: "core/checkbox.tsx",
      },
    ],
  },
  {
    name: "checkbox-group",
    registryDependencies: ["field", "checkbox"],
    files: [
      {
        path: "core/checkbox-group_basic.tsx",
        type: "core",
        target: "core/checkbox-group.tsx",
      },
    ],
  },
  {
    name: "color-area",
    registryDependencies: ["color-thumb"],
    files: [
      {
        path: "core/color-area_basic.tsx",
        type: "core",
        target: "core/color-area.tsx",
      },
    ],
  },
  {
    name: "color-field",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "core/color-field_basic.tsx",
        type: "core",
        target: "core/color-field.tsx",
      },
    ],
  },
  {
    name: "color-picker",
    registryDependencies: [
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
        path: "core/color-picker_basic.tsx",
        type: "core",
        target: "core/color-picker.tsx",
      },
    ],
  },
  {
    name: "color-slider",
    registryDependencies: ["field", "color-thum"],
    files: [
      {
        path: "core/color-slider_basic.tsx",
        type: "core",
        target: "core/color-slider.tsx",
      },
    ],
  },
  {
    name: "color-swatch",
    files: [
      {
        path: "core/color-swatch_basic.tsx",
        type: "core",
        target: "core/color-swatch.tsx",
      },
    ],
  },
  {
    name: "color-swatch-picker",
    registryDependencies: ["focus-styles", "color-swatch"],
    files: [
      {
        path: "core/color-swatch-picker_basic.tsx",
        type: "core",
        target: "core/color-swatch-picker.tsx",
      },
    ],
  },
  {
    name: "color-thumb",
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/color-thumb_basic.tsx",
        type: "core",
        target: "core/color-thumb.tsx",
      },
    ],
  },
  {
    name: "combobox",
    registryDependencies: ["field", "button", "input", "list-box", "overlay"],
    files: [
      {
        path: "core/combobox_basic.tsx",
        type: "core",
        target: "core/combobox.tsx",
      },
    ],
  },
  {
    name: "command",
    files: [
      {
        path: "core/command_basic.tsx",
        type: "core",
        target: "core/command.tsx",
      },
    ],
  },
  {
    name: "date-field",
    registryDependencies: ["field", "input", "date-input"],
    files: [
      {
        path: "core/date-field_basic.tsx",
        type: "core",
        target: "core/date-field.tsx",
      },
    ],
  },
  {
    name: "date-input",
    files: [
      {
        path: "core/date-input_basic.tsx",
        type: "core",
        target: "core/date-input.tsx",
      },
    ],
  },
  {
    name: "date-picker",
    registryDependencies: [
      "button",
      "calendar",
      "field",
      "input",
      "date-input",
      "dialog",
    ],
    files: [
      {
        path: "core/date-picker_basic.tsx",
        type: "core",
        target: "core/date-picker.tsx",
      },
    ],
  },
  {
    name: "date-range-picker",
    registryDependencies: [
      "button",
      "calendar",
      "field",
      "input",
      "date-input",
      "dialog",
    ],
    files: [
      {
        path: "core/date-range-picker_basic.tsx",
        type: "core",
        target: "core/date-range-picker.tsx",
      },
    ],
  },
  {
    name: "dialog",
    registryDependencies: ["overlay"],
    files: [
      {
        path: "core/dialog_basic.tsx",
        type: "core",
        target: "core/dialog.tsx",
      },
    ],
  },
  {
    name: "drawer",
    files: [
      {
        path: "core/drawer_basic.tsx",
        type: "core",
        target: "core/drawer.tsx",
      },
    ],
  },
  {
    name: "drop-zone",
    files: [
      {
        path: "core/drop-zone_basic.tsx",
        type: "core",
        target: "core/drop-zone.tsx",
      },
    ],
  },
  {
    name: "field",
    files: [
      {
        path: "core/field_basic.tsx",
        type: "core",
        target: "core/field.tsx",
      },
    ],
  },
  {
    name: "file-trigger",
    files: [
      {
        path: "core/file-trigger_basic.tsx",
        type: "core",
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
        path: "core/form_basic.tsx",
        type: "core",
        target: "core/form.tsx",
      },
    ],
  },
  {
    name: "form_react-hook-form",
    dependencies: ["react-hook-form"],
    files: [
      {
        path: "core/form_react-hook-form.tsx",
        type: "core",
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
    dependencies: ["@react-aria/utils", "@react-stately/utils"],
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/input_basic.tsx",
        type: "core",
        target: "core/input.tsx",
      },
    ],
  },
  {
    name: "kbd",
    files: [
      {
        path: "core/kbd_basic.tsx",
        type: "core",
        target: "core/kbd.tsx",
      },
    ],
  },
  {
    name: "list-box",
    registryDependencies: ["text", "focus-styles"],
    files: [
      {
        path: "core/list-box_basic.tsx",
        type: "core",
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
        path: "core/loader_dots.tsx",
        type: "core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_line",
    files: [
      {
        path: "core/loader_line.tsx",
        type: "core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_ring",
    files: [
      {
        path: "core/loader_ring.tsx",
        type: "core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_tailspin",
    files: [
      {
        path: "core/loader_tailspin.tsx",
        type: "core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_wave",
    dependencies: ["motion"],
    files: [
      {
        path: "core/loader_wave.tsx",
        type: "core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "menu",
    registryDependencies: ["kbd", "overlay", "text"],
    files: [
      {
        path: "core/menu_basic.tsx",
        type: "core",
        target: "core/menu.tsx",
      },
    ],
  },
  {
    name: "modal",
    files: [
      {
        path: "core/modal_basic.tsx",
        type: "core",
        target: "core/modal.tsx",
      },
    ],
  },
  {
    name: "number-field",
    registryDependencies: ["input", "field", "use-is-mobile"],
    files: [
      {
        path: "core/number-field_basic.tsx",
        type: "core",
        target: "core/number-field.tsx",
      },
    ],
  },
  {
    name: "overlay",
    registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
    files: [
      {
        path: "core/overlay_basic.tsx",
        type: "core",
        target: "core/overlay.tsx",
      },
    ],
  },
  {
    name: "popover",
    files: [
      {
        path: "core/popover_basic.tsx",
        type: "core",
        target: "core/popover.tsx",
      },
    ],
  },
  {
    name: "progress-bar",
    registryDependencies: ["field"],
    files: [
      {
        path: "core/progress-bar_basic.tsx",
        type: "core",
        target: "core/progress-bar.tsx",
      },
    ],
  },
  {
    name: "radio-group",
    registryDependencies: ["focus-styles", "field"],
    files: [
      {
        path: "core/radio-group_basic.tsx",
        type: "core",
        target: "core/radio-group.tsx",
      },
    ],
  },
  {
    name: "search-field",
    registryDependencies: ["field", "button"],
    files: [
      {
        path: "core/search-field_basic.tsx",
        type: "core",
        target: "core/search-field.tsx",
      },
    ],
  },
  {
    name: "select",
    registryDependencies: ["button", "field", "list-box", "popover"],
    files: [
      {
        path: "core/select_basic.tsx",
        type: "core",
        target: "core/select.tsx",
      },
    ],
  },
  {
    name: "separator",
    files: [
      {
        path: "core/separator_basic.tsx",
        type: "core",
        target: "core/separator.tsx",
      },
    ],
  },
  {
    name: "skeleton",
    files: [
      {
        path: "core/skeleton_basic.tsx",
        type: "core",
        target: "core/skeleton.tsx",
      },
    ],
  },
  {
    name: "slider",
    dependencies: ["@react-aria/utils"],
    registryDependencies: ["field", "focus-styles"],
    files: [
      {
        path: "core/slider_basic.tsx",
        type: "core",
        target: "core/slider.tsx",
      },
    ],
  },
  {
    name: "switch",
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/switch_basic.tsx",
        type: "core",
        target: "core/switch.tsx",
      },
    ],
  },
  {
    name: "table",
    registryDependencies: ["checkbox", "focus-styles"],
    files: [
      {
        path: "core/table_basic.tsx",
        type: "core",
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
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/tabs_basic.tsx",
        type: "core",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "tabs_motion",
    dependencies: ["motion"],
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/tabs_motion.tsx",
        type: "core",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "tag-group",
    registryDependencies: ["field", "button", "focus-styles"],
    files: [
      {
        path: "core/tag-group_basic.tsx",
        type: "core",
        target: "core/tag-group.tsx",
      },
    ],
  },
  {
    name: "text",
    files: [
      {
        path: "core/text_basic.tsx",
        type: "core",
        target: "core/text.tsx",
      },
    ],
  },
  {
    name: "text-area",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "core/text-area_basic.tsx",
        type: "core",
        target: "core/text-area.tsx",
      },
    ],
  },
  {
    name: "text-field",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "core/text-field_basic.tsx",
        type: "core",
        target: "core/text-field.tsx",
      },
    ],
  },
  {
    name: "time-field",
    registryDependencies: ["field", "input", "date-input"],
    files: [
      {
        path: "core/time-field_basic.tsx",
        type: "core",
        target: "core/time-field.tsx",
      },
    ],
  },
  {
    name: "toggle-button",
    registryDependencies: ["focus-styles"],
    files: [
      {
        path: "core/toggle-button_basic.tsx",
        type: "core",
        target: "core/toggle-button.tsx",
      },
    ],
  },
  {
    name: "toggle-button-group",
    registryDependencies: ["toggle-button"],
    files: [
      {
        path: "core/toggle-button-group_basic.tsx",
        type: "core",
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
        path: "core/tooltip_basic.tsx",
        type: "core",
        target: "core/tooltip.tsx",
      },
    ],
  },
  {
    name: "tooltip_motion",
    dependencies: ["motion"],
    files: [
      {
        path: "core/tooltip_motion.tsx",
        type: "core",
        target: "core/tooltip.tsx",
      },
    ],
  },
];
