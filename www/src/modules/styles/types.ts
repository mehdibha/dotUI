import { CssColor } from "@adobe/leonardo-contrast-colors";

export type Fonts = {
  heading: string;
  body: string;
};

export type IconLibrary = "lucide" | "remix-icons";

export type Theme = {
  theme: Record<string, string>;
  light: Record<string, string>;
  dark: Record<string, string>;
  css?: {
    [k: string]:
      | string
      | {
          [k: string]:
            | string
            | {
                [k: string]: string;
              };
        };
  };
};

export type Components = {
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
};

export type Preferences = {
  defaultColorScheme: "accent" | "primary";
};

export type ColorBase = {
  baseColors: CssColor[];
  ratios?: number[];
};

export type ColorFoundations = {
  neutral?: ColorBase;
  accent?: ColorBase;
  success?: ColorBase;
  warning?: ColorBase;
  danger?: ColorBase;
  info?: ColorBase;
};

export type ThemeModeFoundations = {
  colors: ColorFoundations;
  lightness?: number;
  saturation?: number;
};

export type ThemeFoundations = {
  light?: ThemeModeFoundations;
  dark?: ThemeModeFoundations;
  theme?: Record<string, string>;
  css?: Theme["css"];
  radius?: number;
};

export type StyleFoundations = {
  name: string;
  label?: string;
  icon?: string;
  theme: ThemeFoundations;
  iconLibrary?: IconLibrary;
  fonts?: Fonts;
  components?: Partial<Components>;
  preferences?: Partial<Preferences>;
};

export type Style = {
  name: string;
  label?: string;
  icon?: string;
  description?: string;
  theme: Theme;
  iconLibrary: IconLibrary;
  fonts: Fonts;
  components: Components;
  preferences: Preferences;
};
