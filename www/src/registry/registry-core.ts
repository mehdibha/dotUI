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
        type: "registry:core",
        path: "core/alert_basic.tsx",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "alert_notch",
    description: "Alert with a bold left border for emphasis.",
    type: "registry:core",
    files: [
      {
        path: "core/alert_notch.tsx",
        type: "registry:core",
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
        type: "registry:core",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "avatar",
    files: [
      {
        path: "core/avatar_basic.tsx",
        type: "registry:core",
        target: "core/avatar.tsx",
      },
    ],
  },
  {
    name: "badge",
    files: [
      {
        path: "core/badge_basic.tsx",
        type: "registry:core",
        target: "core/badge.tsx",
      },
    ],
  },
  {
    name: "breadcrumbs",
    files: [
      {
        path: "core/breadcrumbs_basic.tsx",
        type: "registry:core",
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
    files: [
      {
        path: "core/button_basic.tsx",
        type: "registry:core",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "button_brutalist",
    files: [
      {
        path: "core/button_brutalist.tsx",
        type: "registry:core",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "button_ripple",
    files: [
      {
        path: "core/button_ripple.tsx",
        type: "registry:core",
        target: "core/button.tsx",
      },
      {
        path: "core/ripple.tsx",
        type: "registry:core",
        target: "core/ripple.tsx",
      },
      {
        path: "hooks/use-ripple.ts",
        type: "registry:hook",
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
    files: [
      {
        path: "core/calendar_basic.tsx",
        type: "registry:core",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "calendar_cal",
    files: [
      {
        path: "core/calendar_cal.tsx",
        type: "registry:core",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "checkbox",
    files: [
      {
        path: "core/checkbox_basic.tsx",
        type: "registry:core",
        target: "core/checkbox.tsx",
      },
    ],
  },
  {
    name: "checkbox-group",
    files: [
      {
        path: "core/checkbox-group_basic.tsx",
        type: "registry:core",
        target: "core/checkbox-group.tsx",
      },
    ],
  },
  {
    name: "color-area",
    files: [
      {
        path: "core/color-area_basic.tsx",
        type: "registry:core",
        target: "core/color-area.tsx",
      },
    ],
  },
  {
    name: "color-field",
    files: [
      {
        path: "core/color-field_basic.tsx",
        type: "registry:core",
        target: "core/color-field.tsx",
      },
    ],
  },
  {
    name: "color-picker",
    files: [
      {
        path: "core/color-picker_basic.tsx",
        type: "registry:core",
        target: "core/color-picker.tsx",
      },
    ],
  },
  {
    name: "color-slider",
    files: [
      {
        path: "core/color-slider_basic.tsx",
        type: "registry:core",
        target: "core/color-slider.tsx",
      },
    ],
  },
  {
    name: "color-swatch",
    files: [
      {
        path: "core/color-swatch_basic.tsx",
        type: "registry:core",
        target: "core/color-swatch.tsx",
      },
    ],
  },
  {
    name: "color-swatch-picker",
    files: [
      {
        path: "core/color-swatch-picker_basic.tsx",
        type: "registry:core",
        target: "core/color-swatch-picker.tsx",
      },
    ],
  },
  {
    name: "color-thumb",
    files: [
      {
        path: "core/color-thumb_basic.tsx",
        type: "registry:core",
        target: "core/color-thumb.tsx",
      },
    ],
  },
  {
    name: "combobox",
    files: [
      {
        path: "core/combobox_basic.tsx",
        type: "registry:core",
        target: "core/combobox.tsx",
      },
    ],
  },
  {
    name: "command",
    files: [
      {
        path: "core/command_basic.tsx",
        type: "registry:core",
        target: "core/command.tsx",
      },
    ],
  },
  {
    name: "date-field",
    files: [
      {
        path: "core/date-field_basic.tsx",
        type: "registry:core",
        target: "core/date-field.tsx",
      },
    ],
  },
  {
    name: "date-input",
    files: [
      {
        path: "core/date-input_basic.tsx",
        type: "registry:core",
        target: "core/date-input.tsx",
      },
    ],
  },
  {
    name: "date-picker",
    files: [
      {
        path: "core/date-picker_basic.tsx",
        type: "registry:core",
        target: "core/date-picker.tsx",
      },
    ],
  },
  {
    name: "date-range-picker",
    files: [
      {
        path: "core/date-range-picker_basic.tsx",
        type: "registry:core",
        target: "core/date-range-picker.tsx",
      },
    ],
  },
  {
    name: "dialog",
    files: [
      {
        path: "core/dialog_basic.tsx",
        type: "registry:core",
        target: "core/dialog.tsx",
      },
    ],
  },
  {
    name: "drawer",
    files: [
      {
        path: "core/drawer_basic.tsx",
        type: "registry:core",
        target: "core/drawer.tsx",
      },
    ],
  },
  {
    name: "drop-zone",
    files: [
      {
        path: "core/drop-zone_basic.tsx",
        type: "registry:core",
        target: "core/drop-zone.tsx",
      },
    ],
  },
  {
    name: "field",
    files: [
      {
        path: "core/field_basic.tsx",
        type: "registry:core",
        target: "core/field.tsx",
      },
    ],
  },
  {
    name: "file-trigger",
    files: [
      {
        path: "core/file-trigger_basic.tsx",
        type: "registry:core",
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
        type: "registry:core",
        target: "core/form.tsx",
      },
    ],
  },
  {
    name: "form_react-hook-form",
    files: [
      {
        path: "core/form_react-hook-form.tsx",
        type: "registry:core",
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
    files: [
      {
        path: "core/input_basic.tsx",
        type: "registry:core",
        target: "core/input.tsx",
      },
    ],
  },
  {
    name: "kbd",
    files: [
      {
        path: "core/kbd_basic.tsx",
        type: "registry:core",
        target: "core/kbd.tsx",
      },
    ],
  },
  {
    name: "list-box",
    files: [
      {
        path: "core/list-box_basic.tsx",
        type: "registry:core",
        target: "core/list-box.tsx",
      },
    ],
  },
  {
    name: "list-box",
    files: [
      {
        path: "core/list-box_basic.tsx",
        type: "registry:core",
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
        type: "registry:core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_line",
    files: [
      {
        path: "core/loader_line.tsx",
        type: "registry:core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_ring",
    files: [
      {
        path: "core/loader_ring.tsx",
        type: "registry:core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_tailspin",
    files: [
      {
        path: "core/loader_tailspin.tsx",
        type: "registry:core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "loader_wave",
    files: [
      {
        path: "core/loader_wave.tsx",
        type: "registry:core",
        target: "core/loader.tsx",
      },
    ],
  },
  {
    name: "menu",
    files: [
      {
        path: "core/menu_basic.tsx",
        type: "registry:core",
        target: "core/menu.tsx",
      },
    ],
  },
  {
    name: "modal",
    files: [
      {
        path: "core/modal_basic.tsx",
        type: "registry:core",
        target: "core/modal.tsx",
      },
    ],
  },
  {
    name: "number-field",
    files: [
      {
        path: "core/number-field_basic.tsx",
        type: "registry:core",
        target: "core/number-field.tsx",
      },
    ],
  },
  {
    name: "overlay",
    files: [
      {
        path: "core/overlay_basic.tsx",
        type: "registry:core",
        target: "core/overlay.tsx",
      },
    ],
  },
  {
    name: "popover",
    files: [
      {
        path: "core/popover_basic.tsx",
        type: "registry:core",
        target: "core/popover.tsx",
      },
    ],
  },
  {
    name: "progress-bar",
    files: [
      {
        path: "core/progress-bar_basic.tsx",
        type: "registry:core",
        target: "core/progress-bar.tsx",
      },
    ],
  },
  {
    name: "radio-group",
    files: [
      {
        path: "core/radio-group_basic.tsx",
        type: "registry:core",
        target: "core/radio-group.tsx",
      },
    ],
  },
  {
    name: "search-field",
    files: [
      {
        path: "core/search-field_basic.tsx",
        type: "registry:core",
        target: "core/search-field.tsx",
      },
    ],
  },
  {
    name: "select",
    files: [
      {
        path: "core/select_basic.tsx",
        type: "registry:core",
        target: "core/select.tsx",
      },
    ],
  },
  {
    name: "separator",
    files: [
      {
        path: "core/separator_basic.tsx",
        type: "registry:core",
        target: "core/separator.tsx",
      },
    ],
  },
  {
    name: "skeleton",
    files: [
      {
        path: "core/skeleton_basic.tsx",
        type: "registry:core",
        target: "core/skeleton.tsx",
      },
    ],
  },
  {
    name: "slider",
    files: [
      {
        path: "core/slider_basic.tsx",
        type: "registry:core",
        target: "core/slider.tsx",
      },
    ],
  },
  {
    name: "switch",
    files: [
      {
        path: "core/switch_basic.tsx",
        type: "registry:core",
        target: "core/switch.tsx",
      },
    ],
  },
  {
    name: "table",
    files: [
      {
        path: "core/table_basic.tsx",
        type: "registry:core",
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
    files: [
      {
        path: "core/tabs_basic.tsx",
        type: "registry:core",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "tabs_motion",
    files: [
      {
        path: "core/tabs_motion.tsx",
        type: "registry:core",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "tag-group",
    files: [
      {
        path: "core/tag-group_basic.tsx",
        type: "registry:core",
        target: "core/tag-group.tsx",
      },
    ],
  },
  {
    name: "text",
    files: [
      {
        path: "core/text_basic.tsx",
        type: "registry:core",
        target: "core/text.tsx",
      },
    ],
  },
  {
    name: "text-area",
    files: [
      {
        path: "core/text-area_basic.tsx",
        type: "registry:core",
        target: "core/text-area.tsx",
      },
    ],
  },
  {
    name: "text-field",
    files: [
      {
        path: "core/text-field_basic.tsx",
        type: "registry:core",
        target: "core/text-field.tsx",
      },
    ],
  },
  {
    name: "time-field",
    files: [
      {
        path: "core/time-field_basic.tsx",
        type: "registry:core",
        target: "core/time-field.tsx",
      },
    ],
  },
  {
    name: "toggle-button",
    files: [
      {
        path: "core/toggle-button_basic.tsx",
        type: "registry:core",
        target: "core/toggle-button.tsx",
      },
    ],
  },
  {
    name: "toggle-button-group",
    files: [
      {
        path: "core/toggle-button-group_basic.tsx",
        type: "registry:core",
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
    type: "registry:core",
    files: [
      {
        path: "core/tooltip_basic.tsx",
        type: "registry:core",
        target: "core/tooltip.tsx",
      },
    ],
  },
  {
    name: "tooltip_motion",
    files: [
      {
        path: "core/tooltip_motion.tsx",
        type: "registry:core",
        target: "core/tooltip.tsx",
      },
    ],
  },
];
