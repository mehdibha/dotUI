type RegistryDemoItem = {
  name: string;
  files: string[];
};

type RegistryDemos = RegistryDemoItem[];

const buildDemos = (registryItem: string, demos: string[]): RegistryDemos => {
  return demos.map((demo) => {
    return {
      name: `${registryItem}-${demo}`,
      files: [`registry/demos/${registryItem}/${demo}.tsx`],
    };
  });
};

export const demos: RegistryDemos = [
  ...buildDemos("alert", [
    "action",
    "composition",
    "content",
    "custom-icon",
    "default",
    "title",
    "variants",
  ]),
  ...buildDemos("aspect-ratio", ["as-child", "default"]),
  ...buildDemos("avatar", ["composition", "default", "shape", "sizes"]),
  ...buildDemos("badge", ["default", "icon", "sizes", "variants"]),
  ...buildDemos("breadcrumbs", [
    "basic",
    "composition",
    "disabled",
    "icon",
    "router-integration",
  ]),
  ...buildDemos("button", [
    "default",
    "disabled",
    "link-button",
    "loading",
    "prefix-and-suffix",
    "shapes",
    "sizes",
    "variants",
  ]),
  ...buildDemos("calendar", [
    "composition",
    "controlled",
    "default",
    "disabled",
    "error-message",
    "label",
    "page-behaviour",
    "read-only",
    "uncontrolled",
    "unvailable-dates",
    "validation",
    "visible-months",
  ]),
  ...buildDemos("checkbox-group", [
    "cards",
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "label",
    "read-only",
    "required",
    "uncontrolled",
  ]),
  ...buildDemos("checkbox", [
    "card",
    "controlled",
    "default",
    "disabled",
    "indeterminate",
    "read-only",
    "uncontrolled",
  ]),
  ...buildDemos("color-area", [
    "channels",
    "composition",
    "controlled",
    "default",
    "disabled",
    "uncontrolled",
  ]),
  ...buildDemos("color-field", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "form",
    "label",
    "loading",
    "prefix-and-suffix",
    "read-only",
    "required",
    "sizes",
    "uncontrolled",
  ]),
  ...buildDemos("color-picker", [
    "composition",
    "controlled",
    "default",
    "options",
    "uncontrolled",
  ]),
  ...buildDemos("color-slider", [
    "channel",
    "composition",
    "controlled",
    "default",
    "disabled",
    "label",
    "uncontrolled",
    "vertical",
  ]),
  ...buildDemos("color-swatch", ["default"]),
  ...buildDemos("color-thumb", []),
  ...buildDemos("combobox", [
    "async-loading",
    "basic",
    "composition",
    "contextual-help",
    "controlled",
    "custom-value",
    "description",
    "disabled",
    "label",
    "loading",
    "required",
    "sections",
    "uncontrolled",
    "validation",
  ]),
  ...buildDemos("date-field", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "granularity",
    "hide-time-zone",
    "hour-cycle",
    "label",
    "loading",
    "placeholder",
    "prefix-and-suffix",
    "read-only",
    "required",
    "sizes",
    "time-zones",
    "uncontrolled",
  ]),
  ...buildDemos("date-picker", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "granularity",
    "hide-time-zone",
    "hour-cycle",
    "label",
    "loading",
    "placeholder",
    "prefix",
    "read-only",
    "required",
    "sizes",
    "time-zones",
    "uncontrolled",
  ]),
  ...buildDemos("date-range-picker", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "granularity",
    "hide-time-zone",
    "hour-cycle",
    "label",
    "loading",
    "placeholder",
    "prefix",
    "read-only",
    "required",
    "sizes",
    "time-zones",
    "uncontrolled",
  ]),
  ...buildDemos("dialog", [
    "alert-dialog",
    "async-form-submission",
    "basic",
    "composition",
    "controlled",
    "description",
    "dismiss-button",
    "dismissable",
    "drawer",
    "inset-content",
    "nested",
    "popover",
    "title",
    "types",
  ]),
  ...buildDemos("drop-zone", ["default", "disabled", "file-trigger", "label"]),
  ...buildDemos("file-trigger", [
    "default",
    "directory-selection",
    "file-types",
    "media-capture",
    "multiple-files",
  ]),
  ...buildDemos("link", ["default", "disabled", "icon", "variants"]),
  ...buildDemos("list-box", [
    "async-loading",
    "basic",
    "composition",
    "contact-list",
    "controlled",
    "disabled-items",
    "empty-state",
    "grid",
    "horizontal",
    "image-grid",
    "item-variant",
    "label-and-description",
    "links",
    "loading",
    "prefix-and-suffix",
    "sections",
    "selection-behavior",
    "selection-mode",
    "separator",
    "uncontrolled",
  ]),
  ...buildDemos("menu", [
    "basic",
    "composition",
    "controlled",
    "disabled-items",
    "item-variant",
    "label-and-description",
    "link-items",
    "long-press",
    "multiple-selection",
    "overlay-type",
    "placement",
    "prefix-and-suffix",
    "section",
    "separator",
    "shortcut",
    "single-selection",
    "submenus",
  ]),
  ...buildDemos("number-field", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "format-options",
    "label",
    "read-only",
    "required",
    "sizes",
    "uncontrolled",
  ]),
  ...buildDemos("progress", [
    "composition",
    "custom-color",
    "custom-value-label",
    "default",
    "duration",
    "format-options",
    "indeterminate",
    "label",
    "min-max-values",
    "shape",
    "sizes",
    "toolbar",
    "value-label",
    "variants",
  ]),
  ...buildDemos("radio-group", [
    "cards",
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "label",
    "orientation",
    "read-only",
    "required",
    "uncontrolled",
  ]),
  ...buildDemos("range-calendar", [
    "composition",
    "controlled",
    "default",
    "disabled",
    "error-message",
    "label",
    "non-contiguous-ranges",
    "page-behaviour",
    "read-only",
    "uncontrolled",
    "unvailable-dates",
    "validation",
    "visible-months",
  ]),
  ...buildDemos("scroll-area", ["default", "scrollbars", "sizes"]),
  ...buildDemos("search-field", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "form",
    "label",
    "loading",
    "prefix-and-suffix",
    "read-only",
    "required",
    "sizes",
    "uncontrolled",
  ]),
  ...buildDemos("select", [
    "async-loading",
    "basic",
    "composition",
    "contextual-help",
    "controlled",
    "description",
    "disabled",
    "label",
    "links",
    "loading",
    "placeholder",
    "required",
    "sections",
    "uncontrolled",
    "validation",
  ]),
  ...buildDemos("separator", ["card", "orientation"]),
  ...buildDemos("skeleton", [
    "api-simulation",
    "card",
    "children",
    "fixed-size-children",
    "show",
  ]),
  ...buildDemos("slider", [
    "advanced-composition",
    "composition",
    "controlled",
    "default",
    "description",
    "disabled",
    "format-options",
    "label",
    "range",
    "sizes",
    "step",
    "uncontrolled",
    "value-label",
    "value-scale",
    "vertical",
  ]),
  ...buildDemos("switch", [
    "controlled",
    "default",
    "disabled",
    "label",
    "sizes",
    "uncontrolled",
  ]),
  ...buildDemos("tabs", [
    "basic",
    "controlled",
    "disabled-item",
    "disabled",
    "keyboard-activation",
    "vertical",
  ]),
  ...buildDemos("text-area", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "form",
    "label",
    "loading",
    "prefix-and-suffix",
    "read-only",
    "required",
    "uncontrolled",
  ]),
  ...buildDemos("text-field", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "label",
    "loading",
    "prefix-and-suffix",
    "read-only",
    "required",
    "sizes",
    "uncontrolled",
  ]),
  ...buildDemos("time-field", [
    "composition",
    "contextual-help",
    "controlled",
    "default",
    "description",
    "disabled",
    "error-message",
    "granularity",
    "hide-time-zone",
    "hour-cycle",
    "label",
    "loading",
    "placeholder",
    "prefix-and-suffix",
    "read-only",
    "required",
    "sizes",
    "time-zones",
    "uncontrolled",
  ]),
  ...buildDemos("toggle-button", [
    "controlled",
    "default",
    "disabled",
    "shapes",
    "sizes",
    "uncontrolled",
    "variants",
  ]),
  ...buildDemos("tooltip", [
    "arrow",
    "composition",
    "container-padding",
    "default",
    "delay",
    "flip",
    "offset",
    "placement",
    "with-arrow",
  ]),
];
