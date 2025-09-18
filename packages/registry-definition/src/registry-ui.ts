import type { Registry } from "shadcn/schema";

export const registryUi: Registry["items"] = [
  {
    name: "alert:basic",
    type: "registry:ui",
    description: "Minimal with a subtle border and muted background.",
    files: [
      {
        type: "registry:ui",
        path: "components/alert/basic.tsx",
        target: "ui/alert.tsx",
      },
    ],
  },
  {
    name: "alert:notch",
    type: "registry:ui",
    description: "Alert with a bold left border for emphasis.",
    files: [
      {
        type: "registry:ui",
        path: "components/alert/notch.tsx",
        target: "ui/alert.tsx",
      },
    ],
  },
  {
    name: "alert:notch-2",
    type: "registry:ui",
    description:
      "Alert with a bold left border for emphasis and muted background.",
    files: [
      {
        type: "registry:ui",
        path: "components/alert/notch-2.tsx",
        target: "ui/alert.tsx",
      },
    ],
  },
  {
    name: "avatar:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/avatar/basic.tsx",
        target: "ui/avatar.tsx",
      },
    ],
  },
  {
    name: "badge:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/badge/basic.tsx",
        target: "ui/badge.tsx",
      },
    ],
  },
  {
    name: "breadcrumbs:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/breadcrumbs/basic.tsx",
        target: "ui/breadcrumbs.tsx",
      },
    ],
  },
  {
    name: "button:basic",
    type: "registry:ui",
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/button/basic.tsx",
        target: "ui/button.tsx",
      },
    ],
  },
  {
    name: "button:outline",
    type: "registry:ui",
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/button/outline.tsx",
        target: "ui/button.tsx",
      },
    ],
  },
  {
    name: "button:shine",
    type: "registry:ui",
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/button/shine.tsx",
        target: "ui/button.tsx",
      },
    ],
    // cssVars: {
    //   theme: {
    //     "shadow-shine": "0px 32px 64px -16px #0000004c, 0px 16px 32px -8px #0000004c, 0px 8px 16px -4px #0000003d, 0px 4px 8px -2px #0000003d, 0px -8px 16px -1px #00000029, 0px 2px 4px -1px #0000003d, 0px 0px 0px 1px #000000, inset 0px 0px 0px 1px #ffffff14, inset 0px 1px 0px #ffffff33"
    //   }
    // }
  },
  {
    name: "button:ripple",
    type: "registry:ui",
    registryDependencies: ["loader", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/button/ripple.tsx",
        target: "ui/button.tsx",
      },
      {
        type: "registry:ui",
        path: "components/ripple.tsx",
        target: "ui/ripple.tsx",
      },
      {
        type: "registry:hook",
        path: "hooks/use-ripple.ts",
        target: "hooks/use-ripple.ts",
      },
    ],
  },
  {
    name: "card:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/card/basic.tsx",
        target: "ui/card.tsx",
      },
    ],
    registryDependencies: ["button", "text", "focus-styles"],
  },
  {
    name: "calendar:basic",
    type: "registry:ui",
    registryDependencies: ["button", "text", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/calendar/basic.tsx",
        target: "ui/calendar.tsx",
      },
    ],
  },
  {
    name: "calendar:cal",
    type: "registry:ui",
    registryDependencies: ["button", "text", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/calendar/cal.tsx",
        target: "ui/calendar.tsx",
      },
    ],
  },
  {
    name: "checkbox:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/checkbox/basic.tsx",
        target: "ui/checkbox.tsx",
      },
    ],
  },
  {
    name: "checkbox-group:basic",
    type: "registry:ui",
    registryDependencies: ["field", "checkbox"],
    files: [
      {
        type: "registry:ui",
        path: "components/checkbox-group/basic.tsx",
        target: "ui/checkbox-group.tsx",
      },
    ],
  },
  {
    name: "color-area:basic",
    type: "registry:ui",
    registryDependencies: ["color-thumb"],
    files: [
      {
        type: "registry:ui",
        path: "components/color-area/basic.tsx",
        target: "ui/color-area.tsx",
      },
    ],
  },
  {
    name: "color-field:basic",
    type: "registry:ui",
    registryDependencies: ["field", "input"],
    files: [
      {
        type: "registry:ui",
        path: "components/color-field/basic.tsx",
        target: "ui/color-field.tsx",
      },
    ],
  },
  {
    name: "color-picker:basic",
    type: "registry:ui",
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
        type: "registry:ui",
        path: "components/color-picker/basic.tsx",
        target: "ui/color-picker.tsx",
      },
    ],
  },
  {
    name: "color-slider:basic",
    type: "registry:ui",
    registryDependencies: ["field", "color-thumb"],
    files: [
      {
        type: "registry:ui",
        path: "components/color-slider/basic.tsx",
        target: "ui/color-slider.tsx",
      },
    ],
  },
  {
    name: "color-swatch:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/color-swatch/basic.tsx",
        target: "ui/color-swatch.tsx",
      },
    ],
  },
  {
    name: "color-swatch-picker:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles", "color-swatch"],
    files: [
      {
        type: "registry:ui",
        path: "components/color-swatch-picker/basic.tsx",
        target: "ui/color-swatch-picker.tsx",
      },
    ],
  },
  {
    name: "color-thumb:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/color-thumb/basic.tsx",
        target: "ui/color-thumb.tsx",
      },
    ],
  },
  {
    name: "combobox:basic",
    type: "registry:ui",
    registryDependencies: ["field", "button", "input", "list-box", "overlay"],
    files: [
      {
        type: "registry:ui",
        path: "components/combobox/basic.tsx",
        target: "ui/combobox.tsx",
      },
    ],
  },
  {
    name: "command:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/command/basic.tsx",
        target: "ui/command.tsx",
      },
    ],
  },
  {
    name: "date-field:basic",
    type: "registry:ui",
    registryDependencies: ["field", "input", "date-input"],
    files: [
      {
        type: "registry:ui",
        path: "components/date-field/basic.tsx",
        target: "ui/date-field.tsx",
      },
    ],
  },
  {
    name: "date-input:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/date-input/basic.tsx",
        target: "ui/date-input.tsx",
      },
    ],
  },
  {
    name: "date-picker:basic",
    type: "registry:ui",
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
        type: "registry:ui",
        path: "components/date-picker/basic.tsx",
        target: "ui/date-picker.tsx",
      },
    ],
  },
  {
    name: "date-range-picker:basic",
    type: "registry:ui",
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
        type: "registry:ui",
        path: "components/date-range-picker/basic.tsx",
        target: "ui/date-range-picker.tsx",
      },
    ],
  },
  {
    name: "dialog:basic",
    type: "registry:ui",
    registryDependencies: ["overlay"],
    files: [
      {
        type: "registry:ui",
        path: "components/dialog/basic.tsx",
        target: "ui/dialog.tsx",
      },
    ],
  },
  {
    name: "drawer:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/drawer/basic.tsx",
        target: "ui/drawer.tsx",
      },
    ],
  },
  {
    name: "drop-zone:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/drop-zone/basic.tsx",
        target: "ui/drop-zone.tsx",
      },
    ],
  },
  {
    name: "field:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/field/basic.tsx",
        target: "ui/field.tsx",
      },
    ],
  },
  {
    name: "file-trigger:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/file-trigger/basic.tsx",
        target: "ui/file-trigger.tsx",
      },
    ],
  },
  {
    name: "form:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/form/basic.tsx",
        target: "ui/form.tsx",
      },
    ],
  },
  {
    name: "form:react-hook-form",
    type: "registry:ui",
    dependencies: ["react-hook-form"],
    files: [
      {
        type: "registry:ui",
        path: "components/form/react-hook-form.tsx",
        target: "ui/form.tsx",
      },
    ],
  },
  {
    name: "input:basic",
    type: "registry:ui",
    dependencies: ["@react-aria/utils", "@react-stately/utils"],
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/input/basic.tsx",
        target: "ui/input.tsx",
      },
    ],
  },
  {
    name: "kbd:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/kbd/basic.tsx",
        target: "ui/kbd.tsx",
      },
    ],
  },
  {
    name: "list-box:basic",
    type: "registry:ui",
    registryDependencies: ["text", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/list-box/basic.tsx",
        target: "ui/list-box.tsx",
      },
    ],
  },
  {
    name: "loader:dots",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/loader/dots.tsx",
        target: "ui/loader.tsx",
      },
    ],
  },
  {
    name: "loader:line",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/loader/line.tsx",
        target: "ui/loader.tsx",
      },
    ],
  },
  {
    name: "loader:ring",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/loader/ring.tsx",
        target: "ui/loader.tsx",
      },
    ],
  },
  {
    name: "loader:ring-2",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/loader/ring-2.tsx",
        target: "ui/loader.tsx",
      },
    ],
  },
  {
    name: "loader:tailspin",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/loader/tailspin.tsx",
        target: "ui/loader.tsx",
      },
    ],
  },
  {
    name: "loader:wave",
    type: "registry:ui",
    dependencies: ["motion"],
    files: [
      {
        type: "registry:ui",
        path: "components/loader/wave.tsx",
        target: "ui/loader.tsx",
      },
    ],
  },
  {
    name: "menu:basic",
    type: "registry:ui",
    registryDependencies: ["kbd", "overlay", "text"],
    files: [
      {
        type: "registry:ui",
        path: "components/menu/basic.tsx",
        target: "ui/menu.tsx",
      },
    ],
  },
  {
    name: "modal:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/modal/basic.tsx",
        target: "ui/modal.tsx",
      },
    ],
  },
  {
    name: "number-field:basic",
    type: "registry:ui",
    registryDependencies: ["input", "field", "use-is-mobile"],
    files: [
      {
        type: "registry:ui",
        path: "components/number-field/basic.tsx",
        target: "ui/number-field.tsx",
      },
    ],
  },
  {
    name: "overlay:basic",
    type: "registry:ui",
    registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
    files: [
      {
        type: "registry:ui",
        path: "components/overlay/basic.tsx",
        target: "ui/overlay.tsx",
      },
    ],
  },
  {
    name: "popover:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/popover/basic.tsx",
        target: "ui/popover.tsx",
      },
    ],
  },
  {
    name: "progress-bar:basic",
    type: "registry:ui",
    registryDependencies: ["field"],
    files: [
      {
        type: "registry:ui",
        path: "components/progress-bar/basic.tsx",
        target: "ui/progress-bar.tsx",
      },
    ],
  },
  {
    name: "radio-group:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles", "field"],
    files: [
      {
        type: "registry:ui",
        path: "components/radio-group/basic.tsx",
        target: "ui/radio-group.tsx",
      },
    ],
  },
  {
    name: "search-field:basic",
    type: "registry:ui",
    registryDependencies: ["field", "button"],
    files: [
      {
        type: "registry:ui",
        path: "components/search-field/basic.tsx",
        target: "ui/search-field.tsx",
      },
    ],
  },
  {
    name: "select:basic",
    type: "registry:ui",
    registryDependencies: ["button", "field", "list-box", "popover"],
    files: [
      {
        type: "registry:ui",
        path: "components/select/basic.tsx",
        target: "ui/select.tsx",
      },
    ],
  },
  {
    name: "separator:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/separator/basic.tsx",
        target: "ui/separator.tsx",
      },
    ],
  },
  {
    name: "skeleton:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/skeleton/basic.tsx",
        target: "ui/skeleton.tsx",
      },
    ],
  },
  {
    name: "slider:basic",
    type: "registry:ui",
    dependencies: ["@react-aria/utils"],
    registryDependencies: ["field", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/slider/basic.tsx",
        target: "ui/slider.tsx",
      },
    ],
  },
  {
    name: "switch:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/switch/basic.tsx",
        target: "ui/switch.tsx",
      },
    ],
  },
  {
    name: "table:basic",
    type: "registry:ui",
    registryDependencies: ["checkbox", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/table/basic.tsx",
        target: "ui/table.tsx",
      },
    ],
  },
  {
    name: "tabs:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/tabs/basic.tsx",
        target: "ui/tabs.tsx",
      },
    ],
  },
  {
    name: "tabs:motion",
    type: "registry:ui",
    dependencies: ["motion"],
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/tabs/motion.tsx",
        target: "ui/tabs.tsx",
      },
    ],
  },
  {
    name: "tag-group:basic",
    type: "registry:ui",
    registryDependencies: ["field", "button", "focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/tag-group/basic.tsx",
        target: "ui/tag-group.tsx",
      },
    ],
  },
  {
    name: "text:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/text/basic.tsx",
        target: "ui/text.tsx",
      },
    ],
  },
  {
    name: "text-area:basic",
    type: "registry:ui",
    registryDependencies: ["field", "input"],
    files: [
      {
        type: "registry:ui",
        path: "components/text-area/basic.tsx",
        target: "ui/text-area.tsx",
      },
    ],
  },
  {
    name: "text-field:basic",
    type: "registry:ui",
    registryDependencies: ["field", "input"],
    files: [
      {
        type: "registry:ui",
        path: "components/text-field/basic.tsx",
        target: "ui/text-field.tsx",
      },
    ],
  },
  {
    name: "time-field:basic",
    type: "registry:ui",
    registryDependencies: ["field", "input", "date-input"],
    files: [
      {
        type: "registry:ui",
        path: "components/time-field/basic.tsx",
        target: "ui/time-field.tsx",
      },
    ],
  },
  {
    name: "toggle-button:basic",
    type: "registry:ui",
    registryDependencies: ["focus-styles"],
    files: [
      {
        type: "registry:ui",
        path: "components/toggle-button/basic.tsx",
        target: "ui/toggle-button.tsx",
      },
    ],
  },
  {
    name: "toggle-button-group:basic",
    type: "registry:ui",
    registryDependencies: ["toggle-button"],
    files: [
      {
        type: "registry:ui",
        path: "components/toggle-button-group/basic.tsx",
        target: "ui/toggle-button-group.tsx",
      },
    ],
  },
  {
    name: "tooltip:basic",
    type: "registry:ui",
    files: [
      {
        type: "registry:ui",
        path: "components/tooltip/basic.tsx",
        target: "ui/tooltip.tsx",
      },
    ],
  },
  {
    name: "tooltip:motion",
    type: "registry:ui",
    dependencies: ["motion"],
    files: [
      {
        type: "registry:ui",
        path: "components/tooltip/motion.tsx",
        target: "ui/tooltip.tsx",
      },
    ],
  },
];
