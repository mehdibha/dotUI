// --------------------------------- Utility Types --------------------------------- //

export type Css = Record<
  string,
  string | Record<string, string | Record<string, string>>
>;

// --------------------------------- Icon Types --------------------------------- //

export type IconLibrary = string;

export interface IconsDefinition {
  library: IconLibrary;
  strokeWidth: number;
}

// --------------------------------- Color Types --------------------------------- //

export interface ColorScale {
  name: string;
  colorKeys: string[];
  ratios: number[];
  smooth: boolean;
  overrides: Record<string, string>;
}

export interface ColorToken {
  name: string;
  value: string;
}

export type ColorTokens = Record<string, ColorToken>;

export interface ModeDefinition {
  lightness: number;
  saturation: number;
  contrast: number;
  scales: {
    neutral: ColorScale;
    accent: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    danger: ColorScale;
    info: ColorScale;
  };
}

export type ScaleId =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type ColorFormat = "oklch" | "hex" | "hsl";

// --------------------------------- Layout Types --------------------------------- //

export type Radius = number;
export type Spacing = number;

// --------------------------------- Typography Types --------------------------------- //

export interface Fonts {
  heading: string;
  body: string;
}

export type LetterSpacing = number;

// --------------------------------- Effects Types --------------------------------- //

export type BackgroundPattern = string;
export type Texture = string;

export type Shadows =
  | "default"
  | {
      color: string;
      opacity: number;
      blurRadius: number;
      offsetX: number;
      offsetY: number;
      spread: number;
    };

// --------------------------------- Theme Types --------------------------------- //

export interface ThemeDefinition {
  colors: {
    activeModes: ("light" | "dark")[];
    modes: {
      light: ModeDefinition;
      dark: ModeDefinition;
    };
    tokens: ColorTokens;
    accentEmphasisLevel: number;
  };
  radius: Radius;
  spacing: Spacing;
  fonts: Fonts;
  letterSpacing: LetterSpacing;
  backgroundPattern: BackgroundPattern;
  texture: Texture;
  shadows: Shadows;
}

export interface Theme {
  css?: Css;
  cssVars: {
    light: Record<string, string>;
    dark?: Record<string, string>;
    theme: Record<string, string>;
  };
}

// --------------------------------- Variant Types --------------------------------- //

/**
 * VariantsDefinition is used for user-configurable variant selection
 * (the simplified variant groups like "buttons", "inputs", etc.)
 */
export interface VariantsDefinition {
  alert: string;
  buttons: string;
  calendars: string;
  card: string;
  checkboxes: string;
  "focus-style": string;
  inputs: string;
  link: string;
  "list-box-and-menu": string;
  loader: string;
  overlays: string;
  pickers: string;
  radios: string;
  selection: string;
  skeleton: string;
  slider: string;
  switch: string;
  "badge-and-tag-group": string;
  tooltip: string;
}

/**
 * Variants is the processed/resolved variant mapping for all components
 */
export interface Variants {
  accordion: string;
  alert: string;
  avatar: string;
  badge: string;
  breadcrumbs: string;
  button: string;
  calendar: string;
  card: string;
  checkbox: string;
  "checkbox-group": string;
  "color-area": string;
  "color-editor": string;
  "color-field": string;
  "color-picker": string;
  "color-slider": string;
  "color-swatch": string;
  "color-swatch-picker": string;
  "color-thumb": string;
  combobox: string;
  command: string;
  "date-field": string;
  "date-picker": string;
  dialog: string;
  disclosure: string;
  drawer: string;
  "drop-zone": string;
  empty: string;
  field: string;
  "file-trigger": string;
  "focus-styles": string;
  form: string;
  group: string;
  input: string;
  kbd: string;
  link: string;
  "list-box": string;
  loader: string;
  menu: string;
  modal: string;
  "number-field": string;
  overlay: string;
  popover: string;
  "progress-bar": string;
  "radio-group": string;
  "search-field": string;
  select: string;
  separator: string;
  skeleton: string;
  slider: string;
  switch: string;
  table: string;
  tabs: string;
  "tag-group": string;
  text: string;
  "text-field": string;
  "time-field": string;
  toast: string;
  "toggle-button": string;
  "toggle-button-group": string;
  tooltip: string;
}

// --------------------------------- Style Types --------------------------------- //

export interface StyleDefinition {
  theme: ThemeDefinition;
  icons: IconsDefinition;
  variants: VariantsDefinition;
}

export interface Style {
  theme: Theme;
  icons: IconsDefinition;
  variants: Variants;
}

// --------------------------------- Texture/Pattern Registry Types --------------------------------- //

export interface TextureRegistryItem {
  slug: string;
  css: Record<string, Record<string, string>>;
}

export interface BackgroundPatternRegistryItem {
  slug: string;
  css: Record<string, Record<string, string>>;
}
