import type { Registry } from "./types";

export const core: Registry = [
  {
    name: "alert",
    type: "registry:core",
    variants: ["basic", "notch", "notch-2"],
  },
  {
    name: "alert_basic",
    description: "Minimal with a subtle border and muted background.",
    type: "registry:core",
    files: [
      {
        path: "core/alert_basic.tsx",
        type: "registry:core",
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
    name: "avatar",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
    variants: ["basic", "brutalist", "ripple"],
  },
  {
    name: "button_basic",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
        path: "hooks/use-ripple.tsx",
        type: "registry:hook",
        target: "hooks/use-ripple.tsx",
      },
    ],
  },
  {
    name: "calendar",
    type: "registry:core",
    variants: ["basic", "cal"],
  },
  {
    name: "calendar_basic",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
    variants: ["basic", "react-hook-form"],
  },
  {
    name: "form_basic",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
    variants: ["basic"],
  },
  {
    name: "input_basic",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
    variants: ["dots", "line", "ring", "tailspin", "wave"],
  },
  {
    name: "loader_dots",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
    variants: ["basic", "motion"],
  },
  {
    name: "tabs_basic",
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
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
    type: "registry:core",
    files: [
      {
        path: "core/tooltip_motion.tsx",
        type: "registry:core",
        target: "core/tooltip.tsx",
      },
    ],
  },
];
