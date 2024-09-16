import { Registry } from "@/registry/schema";

export const core: Registry = [
  {
    name: "alert",
    type: "registry:core",
    files: [
      {
        path: "core/alert/alert.tsx",
        type: "registry:core",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "aspect-ratio",
    type: "registry:core",
    dependencies: ["@radix-ui/react-aspect-ratio"],
    files: [
      {
        path: "core/aspect-ratio/aspect-ratio.tsx",
        type: "registry:core",
        target: "core/aspect-ratio.tsx",
      },
    ],
  },
  {
    name: "avatar",
    type: "registry:core",
    files: [
      {
        path: "core/avatar/avatar.tsx",
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
        path: "core/badge/badge.tsx",
        type: "registry:core",
        target: "core/badge.tsx",
      },
    ],
  },
  {
    name: "breadcrumbs",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/breadcrumbs/breadcrumbs.tsx",
        type: "registry:core",
        target: "core/breadcrumbs.tsx",
      },
    ],
  },
  {
    name: "button",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/button/button.tsx",
        type: "registry:core",
        target: "core/button.tsx",
      },
    ],
  },
  {
    name: "calendar",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["button", "heading", "text"],
    files: [
      {
        path: "core/calendar/calendar.tsx",
        type: "registry:core",
        target: "core/calendar.tsx",
      },
    ],
  },
  {
    name: "checkbox",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/checkbox/checkbox.tsx",
        type: "registry:core",
        target: "core/checkbox.tsx",
      },
    ],
  },
  {
    name: "checkbox-group",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["checkbox"],
    files: [
      {
        path: "core/checkbox-group/checkbox-group.tsx",
        type: "registry:core",
        target: "core/checkbox-group.tsx",
      },
    ],
  },
  {
    name: "color-area",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["color-thumb"],
    files: [
      {
        path: "core/color-area/color-area.tsx",
        type: "registry:core",
        target: "core/color-area.tsx",
      },
    ],
  },
  {
    name: "color-field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "core/color-field/color-field.tsx",
        type: "registry:core",
        target: "core/color-field.tsx",
      },
    ],
  },
  {
    name: "color-picker",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: [
      "button",
      "color-area",
      "color-field",
      "color-slider",
      "color-swatch",
      "dialog",
      "list-box",
      "select",
    ],
    files: [
      {
        path: "core/color-picker/color-picker.tsx",
        type: "registry:core",
        target: "core/color-picker.tsx",
      },
    ],
  },
  {
    name: "color-slider",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["color-thumb", "field"],
    files: [
      {
        path: "core/color-slider/color-slider.tsx",
        type: "registry:core",
        target: "core/color-slider.tsx",
      },
    ],
  },
  {
    name: "color-swatch",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/color-swatch/color-swatch.tsx",
        type: "registry:core",
        target: "core/color-swatch.tsx",
      },
    ],
  },
  {
    name: "color-thumb",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/color-thumb/color-thumb.tsx",
        type: "registry:core",
        target: "core/color-thumb.tsx",
      },
    ],
  },
  {
    name: "combobox",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["button", "field", "input", "list-box", "overlay"],
    files: [
      {
        path: "core/combobox/combobox.tsx",
        type: "registry:core",
        target: "core/combobox.tsx",
      },
    ],
  },
  {
    name: "date-field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["date-input", "field", "input"],
    files: [
      {
        path: "core/date-field/date-field.tsx",
        type: "registry:core",
        target: "core/date-field.tsx",
      },
    ],
  },
  {
    name: "date-input",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/date-input/date-input.tsx",
        type: "registry:core",
        target: "core/date-input.tsx",
      },
    ],
  },
  {
    name: "date-picker",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: [
      "button",
      "calendar",
      "dialog",
      "date-input",
      "field",
      "input",
    ],
    files: [
      {
        path: "core/date-picker/date-picker.tsx",
        type: "registry:core",
        target: "core/date-picker.tsx",
      },
    ],
  },
  {
    name: "date-range-picker",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: [
      "button",
      "range-calendar",
      "dialog",
      "date-input",
      "field",
      "input",
    ],
    files: [
      {
        path: "core/date-range-picker/date-range-picker.tsx",
        type: "registry:core",
        target: "core/date-range-picker.tsx",
      },
    ],
  },
  {
    name: "dialog",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["overlay", "heading", "text"],
    files: [
      {
        path: "core/dialog/dialog.tsx",
        type: "registry:core",
        target: "core/dialog.tsx",
      },
    ],
  },
  {
    name: "drop-zone",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/drop-zone/drop-zone.tsx",
        type: "registry:core",
        target: "core/drop-zone.tsx",
      },
    ],
  },
  {
    name: "field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/field/field.tsx",
        type: "registry:core",
        target: "core/field.tsx",
      },
    ],
  },
  {
    name: "file-trigger",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/file-trigger/file-trigger.tsx",
        type: "registry:core",
        target: "core/file-trigger.tsx",
      },
    ],
  },
  {
    name: "group",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/group/group.tsx",
        type: "registry:core",
        target: "core/group.tsx",
      },
    ],
  },
  {
    name: "heading",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/heading/heading.tsx",
        type: "registry:core",
        target: "core/heading.tsx",
      },
    ],
  },
  {
    name: "input",
    type: "registry:core",
    dependencies: [
      "react-aria-components",
      "@react-aria/utils",
      "@react-stately/utils",
    ],
    files: [
      {
        path: "core/input/input.tsx",
        type: "registry:core",
        target: "core/input.tsx",
      },
    ],
  },
  {
    name: "kbd",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/kbd/kbd.tsx",
        type: "registry:core",
        target: "core/kbd.tsx",
      },
    ],
  },
  {
    name: "link",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/link/link.tsx",
        type: "registry:core",
        target: "core/link.tsx",
      },
    ],
  },
  {
    name: "list-box",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["text"],
    files: [
      {
        path: "core/list-box/list-box.tsx",
        type: "registry:core",
        target: "core/list-box.tsx",
      },
    ],
  },
  {
    name: "menu",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["overlay", "kbd", "text"],
    files: [
      {
        path: "core/menu/menu.tsx",
        type: "registry:core",
        target: "core/menu.tsx",
      },
    ],
  },
  // TODO: add useMediaQuery
  {
    name: "number-field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["input", "field", "button"],
    files: [
      {
        path: "core/number-field/number-field.tsx",
        type: "registry:core",
        target: "core/number-field.tsx",
      },
    ],
  },
  // TODO: add useMediaQuery
  {
    name: "overlay",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["button"],
    files: [
      {
        path: "core/overlay/overlay.tsx",
        type: "registry:core",
        target: "core/overlay.tsx",
      },
      {
        path: "core/overlay/use-motion-drawer.tsx",
        type: "registry:core",
        target: "core/overlay.tsx",
      },
    ],
  },
  {
    name: "progress",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field"],
    files: [
      {
        path: "core/progress/progress.tsx",
        type: "registry:core",
        target: "core/progress.tsx",
      },
    ],
  },
  {
    name: "radio-group",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field"],
    files: [
      {
        path: "core/radio-group/radio-group.tsx",
        type: "registry:core",
        target: "core/radio-group.tsx",
      },
    ],
  },
  {
    name: "range-calendar",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["button", "calendar", "heading", "text"],
    files: [
      {
        path: "core/range-calendar/range-calendar.tsx",
        type: "registry:core",
        target: "core/range-calendar.tsx",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:core",
    dependencies: ["@radix-ui/react-scroll-area"],
    files: [
      {
        path: "core/scroll-area/scroll-area.tsx",
        type: "registry:core",
        target: "core/scroll-area.tsx",
      },
    ],
  },
  {
    name: "search-field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["button", "field", "input"],
    files: [
      {
        path: "core/search-field/search-field.tsx",
        type: "registry:core",
        target: "core/search-field.tsx",
      },
    ],
  },
  {
    name: "section",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/section/section.tsx",
        type: "registry:core",
        target: "core/section.tsx",
      },
    ],
  },
  {
    name: "select",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["button", "field", "list-box", "overlay"],
    files: [
      {
        path: "core/select/select.tsx",
        type: "registry:core",
        target: "core/select.tsx",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/separator/separator.tsx",
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
        path: "core/separator/separator.tsx",
        type: "registry:core",
        target: "core/separator.tsx",
      },
    ],
  },
  {
    name: "slider",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field"],
    files: [
      {
        path: "core/slider/slider.tsx",
        type: "registry:core",
        target: "core/slider.tsx",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/switch/switch.tsx",
        type: "registry:core",
        target: "core/switch.tsx",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/tabs/tabs.tsx",
        type: "registry:core",
        target: "core/tabs.tsx",
      },
    ],
  },
  {
    name: "text",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/text/text.tsx",
        type: "registry:core",
        target: "core/text.tsx",
      },
    ],
  },
  {
    name: "text-area",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "input", "text-field"],
    files: [
      {
        path: "core/text-area/text-area.tsx",
        type: "registry:core",
        target: "core/text-area.tsx",
      },
    ],
  },
  {
    name: "text-field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "core/text-field/text-field.tsx",
        type: "registry:core",
        target: "core/text-field.tsx",
      },
    ],
  },
  {
    name: "time-field",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "input", "date-input"],
    files: [
      {
        path: "core/time-field/time-field.tsx",
        type: "registry:core",
        target: "core/time-field.tsx",
      },
    ],
  },
  {
    name: "toggle-button",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "core/toggle-button/toggle-button.tsx",
        type: "registry:core",
        target: "core/toggle-button.tsx",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:core",
    dependencies: ["react-aria-components"],
    registryDependencies: ["overlay", "text"],
    files: [
      {
        path: "core/tooltip/tooltip.tsx",
        type: "registry:core",
        target: "core/tooltip.tsx",
      },
    ],
  },
];
