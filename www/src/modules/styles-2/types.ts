export type Fonts = {
  heading: string;
  body: string;
};

export type IconLibrary = "lucide" | "remix-icons";

export type Theme = {
  light: Record<string, string>;
  dark: Record<string, string>;
  cssVars: Record<string, string>;
};

export type Components = {
  button?: "basic";
  input?: "basic";
};

export type Style = {
  name: string;
  description?: string;
  theme: Theme;
  iconLibrary: IconLibrary;
  fonts: Fonts;
  components: Components;
};
