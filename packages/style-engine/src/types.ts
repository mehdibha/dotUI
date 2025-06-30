export interface Fonts {
  heading: string;
  body: string;
}

export type IconLibrary = "lucide" | "remix-icons";

export interface Variants {
  alert: "basic" | "notch" | "notch-2";
  avatar: "basic";
  badge: "basic";
  breadcrumbs: "basic";
  button: "basic" | "outline" | "brutalist" | "ripple";
  "button-group": "basic";
  calendar: "basic" | "cal";
  checkbox: "basic";
  "checkbox-group": "basic";
  "color-area": "basic";
  "color-field": "basic";
  "color-picker": "basic";
  "color-slider": "basic";
  "color-swatch": "basic";
  "color-swatch-picker": "basic";
  "color-thumb": "basic";
  combobox: "basic";
  command: "basic";
  "date-field": "basic";
  "date-input": "basic";
  "date-picker": "basic";
  "date-range-picker": "basic";
  dialog: "basic";
  drawer: "basic";
  "drop-zone": "basic";
  field: "basic";
  "file-trigger": "basic";
  form: "basic" | "react-hook-form";
  input: "basic";
  kbd: "basic";
  "list-box": "basic";
  loader: "dots" | "line" | "ring" | "tailspin" | "wave";
  menu: "basic";
  modal: "basic" | "blur";
  "number-field": "basic";
  overlay: "basic";
  popover: "basic";
  "progress-bar": "basic";
  "radio-group": "basic";
  ripple: "basic";
  "search-field": "basic";
  select: "basic";
  separator: "basic";
  skeleton: "basic";
  slider: "basic";
  switch: "basic";
  table: "basic";
  tabs: "basic" | "motion";
  "tag-group": "basic";
  text: "basic";
  "text-area": "basic";
  "text-field": "basic";
  "time-field": "basic";
  "toggle-button": "basic";
  "toggle-button-group": "basic";
  tooltip: "basic" | "motion";
}

export interface Style {
  name: string;
  slug: string;
  description: string;
  iconLibrary: IconLibrary;
  fonts: Fonts;
  variants: Variants;
}
