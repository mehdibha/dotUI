import type { Registry } from "./types";

export const ui: Registry = [
  {
    name: "alert",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        description: "Minimal with a subtle border and muted background.",
        files: [
          {
            type: "registry:ui",
            path: "ui/alert.basic.tsx",
            target: "ui/alert.tsx",
          },
        ],
      },
      {
        name: "notch",
        type: "registry:ui",
        description: "Alert with a bold left border for emphasis.",
        files: [
          {
            type: "registry:ui",
            path: "ui/alert.notch.tsx",
            target: "ui/alert.tsx",
          },
        ],
      },
      {
        name: "notch-2",
        type: "registry:ui",
        description:
          "Alert with a bold left border for emphasis and muted background.",
        files: [
          {
            type: "registry:ui",
            path: "ui/alert.notch-2.tsx",
            target: "ui/alert.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "avatar",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/avatar.basic.tsx",
            target: "ui/avatar.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/badge.basic.tsx",
            target: "ui/badge.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "breadcrumbs",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/breadcrumbs.basic.tsx",
            target: "ui/breadcrumbs.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["loader", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/button.basic.tsx",
            target: "ui/button.tsx",
          },
        ],
      },
      {
        name: "brutalist",
        type: "registry:ui",
        registryDependencies: ["loader", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/button.brutalist.tsx",
            target: "ui/button.tsx",
          },
        ],
      },
      {
        name: "ripple",
        type: "registry:ui",
        registryDependencies: ["loader", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/button.ripple.tsx",
            target: "ui/button.tsx",
          },
          {
            type: "registry:ui",
            path: "ui/ripple.tsx",
            target: "ui/ripple.tsx",
          },
          {
            type: "registry:hook",
            path: "hooks/use-ripple.ts",
            target: "hooks/use-ripple.ts",
          },
        ],
      },
    ],
  },
  {
    name: "calendar",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["button", "text", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/calendar.basic.tsx",
            target: "ui/calendar.tsx",
          },
        ],
      },
      {
        name: "cal",
        type: "registry:ui",
        registryDependencies: ["button", "text", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/calendar.cal.tsx",
            target: "ui/calendar.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/checkbox.basic.tsx",
            target: "ui/checkbox.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "checkbox-group",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "checkbox"],
        files: [
          {
            type: "registry:ui",
            path: "ui/checkbox-group.basic.tsx",
            target: "ui/checkbox-group.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-area",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["color-thumb"],
        files: [
          {
            type: "registry:ui",
            path: "ui/color-area.basic.tsx",
            target: "ui/color-area.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "input"],
        files: [
          {
            type: "registry:ui",
            path: "ui/color-field.basic.tsx",
            target: "ui/color-field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-picker",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
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
            path: "ui/color-picker.basic.tsx",
            target: "ui/color-picker.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-slider",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "color-thum"],
        files: [
          {
            type: "registry:ui",
            path: "ui/color-slider.basic.tsx",
            target: "ui/color-slider.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-swatch",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/color-swatch.basic.tsx",
            target: "ui/color-swatch.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-swatch-picker",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles", "color-swatch"],
        files: [
          {
            type: "registry:ui",
            path: "ui/color-swatch-picker.basic.tsx",
            target: "ui/color-swatch-picker.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "color-thumb",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/color-thumb.basic.tsx",
            target: "ui/color-thumb.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "combobox",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: [
          "field",
          "button",
          "input",
          "list-box",
          "overlay",
        ],
        files: [
          {
            type: "registry:ui",
            path: "ui/combobox.basic.tsx",
            target: "ui/combobox.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "command",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/command.basic.tsx",
            target: "ui/command.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "date-field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "input", "date-input"],
        files: [
          {
            type: "registry:ui",
            path: "ui/date-field.basic.tsx",
            target: "ui/date-field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "date-input",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/date-input.basic.tsx",
            target: "ui/date-input.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "date-picker",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
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
            path: "ui/date-picker.basic.tsx",
            target: "ui/date-picker.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "date-range-picker",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
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
            path: "ui/date-range-picker.basic.tsx",
            target: "ui/date-range-picker.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["overlay"],
        files: [
          {
            type: "registry:ui",
            path: "ui/dialog.basic.tsx",
            target: "ui/dialog.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/drawer.basic.tsx",
            target: "ui/drawer.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "drop-zone",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/drop-zone.basic.tsx",
            target: "ui/drop-zone.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/field.basic.tsx",
            target: "ui/field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "file-trigger",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/file-trigger.basic.tsx",
            target: "ui/file-trigger.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "form",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/form.basic.tsx",
            target: "ui/form.tsx",
          },
        ],
      },
      {
        name: "react-hook-form",
        type: "registry:ui",
        dependencies: ["react-hook-form"],
        files: [
          {
            type: "registry:ui",
            path: "ui/form.react-hook-form.tsx",
            target: "ui/form.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        dependencies: ["@react-aria/utils", "@react-stately/utils"],
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/input.basic.tsx",
            target: "ui/input.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "kbd",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/kbd.basic.tsx",
            target: "ui/kbd.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "list-box",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["text", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/list-box.basic.tsx",
            target: "ui/list-box.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "loader",
    type: "registry:ui",
    styles: [
      {
        name: "dots",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/loader.dots.tsx",
            target: "ui/loader.tsx",
          },
        ],
      },
      {
        name: "line",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/loader.line.tsx",
            target: "ui/loader.tsx",
          },
        ],
      },
      {
        name: "ring",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/loader.ring.tsx",
            target: "ui/loader.tsx",
          },
        ],
      },
      {
        name: "tailspin",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/loader.tailspin.tsx",
            target: "ui/loader.tsx",
          },
        ],
      },
      {
        name: "wave",
        type: "registry:ui",
        dependencies: ["motion"],
        files: [
          {
            type: "registry:ui",
            path: "ui/loader.wave.tsx",
            target: "ui/loader.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "menu",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["kbd", "overlay", "text"],
        files: [
          {
            type: "registry:ui",
            path: "ui/menu.basic.tsx",
            target: "ui/menu.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "modal",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/modal.basic.tsx",
            target: "ui/modal.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "number-field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["input", "field", "use-is-mobile"],
        files: [
          {
            type: "registry:ui",
            path: "ui/number-field.basic.tsx",
            target: "ui/number-field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "overlay",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
        files: [
          {
            type: "registry:ui",
            path: "ui/overlay.basic.tsx",
            target: "ui/overlay.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/popover.basic.tsx",
            target: "ui/popover.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "progress-bar",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field"],
        files: [
          {
            type: "registry:ui",
            path: "ui/progress-bar.basic.tsx",
            target: "ui/progress-bar.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles", "field"],
        files: [
          {
            type: "registry:ui",
            path: "ui/radio-group.basic.tsx",
            target: "ui/radio-group.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "search-field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "button"],
        files: [
          {
            type: "registry:ui",
            path: "ui/search-field.basic.tsx",
            target: "ui/search-field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["button", "field", "list-box", "popover"],
        files: [
          {
            type: "registry:ui",
            path: "ui/select.basic.tsx",
            target: "ui/select.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/separator.basic.tsx",
            target: "ui/separator.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/skeleton.basic.tsx",
            target: "ui/skeleton.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "focus-styles"],
        dependencies: ["@react-aria/utils"],
        files: [
          {
            type: "registry:ui",
            path: "ui/slider.basic.tsx",
            target: "ui/slider.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/switch.basic.tsx",
            target: "ui/switch.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["checkbox", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/table.basic.tsx",
            target: "ui/table.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/tabs.basic.tsx",
            target: "ui/tabs.tsx",
          },
        ],
      },
      {
        name: "motion",
        type: "registry:ui",
        dependencies: ["motion"],
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/tabs.motion.tsx",
            target: "ui/tabs.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "tag-group",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "button", "focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/tag-group.basic.tsx",
            target: "ui/tag-group.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "text",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/text.basic.tsx",
            target: "ui/text.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "text-area",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "input"],
        files: [
          {
            type: "registry:ui",
            path: "ui/text-area.basic.tsx",
            target: "ui/text-area.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "text-field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "input"],
        files: [
          {
            type: "registry:ui",
            path: "ui/text-field.basic.tsx",
            target: "ui/text-field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "time-field",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["field", "input", "date-input"],
        files: [
          {
            type: "registry:ui",
            path: "ui/time-field.basic.tsx",
            target: "ui/time-field.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "toggle-button",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["focus-styles"],
        files: [
          {
            type: "registry:ui",
            path: "ui/toggle-button.basic.tsx",
            target: "ui/toggle-button.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "toggle-button-group",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        registryDependencies: ["toggle-button"],
        files: [
          {
            type: "registry:ui",
            path: "ui/toggle-button-group.basic.tsx",
            target: "ui/toggle-button-group.tsx",
          },
        ],
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    styles: [
      {
        name: "basic",
        type: "registry:ui",
        files: [
          {
            type: "registry:ui",
            path: "ui/tooltip.basic.tsx",
            target: "ui/tooltip.tsx",
          },
        ],
      },
      {
        name: "motion",
        type: "registry:ui",
        dependencies: ["motion"],
        files: [
          {
            type: "registry:ui",
            path: "ui/tooltip.motion.tsx",
            target: "ui/tooltip.tsx",
          },
        ],
      },
    ],
  },
];
