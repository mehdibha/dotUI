import type { StyleConfig } from "@dotui/core/schemas";

interface DefaultStyle {
  name: string;
  config: StyleConfig;
}

export const DEFAULT_STYLES: DefaultStyle[] = [
  {
    name: "minimalist",
    config: {
      theme: {
        colors: {
          algorithm: "material",
          palettes: {
            primary: "#0A0A0A",
          },
          modes: {
            light: true,
            dark: true,
          },
        },
        radius: 0.5,
        spacing: 4,
        typography: {
          font: "Inter",
        },
      },
      icons: {
        library: "lucide",
        strokeWidth: 2,
      },
      variants: {},
    },
  },
];
