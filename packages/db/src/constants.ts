import type { z } from "zod/v4";

import type { createStyleSchema } from "./schema";

const DEFAULT_COLOR_TOKENS = [
  {
    id: "color-bg",
    name: "color-bg",
    value: "var(--neutral-100)",
  },
  {
    id: "color-bg-muted",
    name: "color-bg-muted",
    value: "var(--neutral-200)",
  },
  {
    id: "color-bg-inverse",
    name: "color-bg-inverse",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-bg-disabled",
    name: "color-bg-disabled",
    value: "var(--neutral-200)",
  },

  {
    id: "color-bg-neutral",
    name: "color-bg-neutral",
    value: "var(--neutral-200)",
  },
  {
    id: "color-bg-neutral-hover",
    name: "color-bg-neutral-hover",
    value: "var(--neutral-300)",
  },
  {
    id: "color-bg-neutral-active",
    name: "color-bg-neutral-active",
    value: "var(--neutral-400)",
  },

  {
    id: "color-bg-primary",
    name: "color-bg-primary",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-bg-primary-hover",
    name: "color-bg-primary-hover",
    value: "var(--neutral-900)",
  },
  {
    id: "color-bg-primary-active",
    name: "color-bg-primary-active",
    value: "var(--neutral-800)",
  },
  {
    id: "color-bg-primary-muted",
    name: "color-bg-primary-muted",
    value: "var(--neutral-200)",
  },

  {
    id: "color-bg-success",
    name: "color-bg-success",
    value: "var(--success-500)",
  },
  {
    id: "color-bg-success-hover",
    name: "color-bg-success-hover",
    value: "var(--success-600)",
  },
  {
    id: "color-bg-success-active",
    name: "color-bg-success-active",
    value: "var(--success-700)",
  },
  {
    id: "color-bg-success-muted",
    name: "color-bg-success-muted",
    value: "var(--success-200)",
  },

  {
    id: "color-bg-warning",
    name: "color-bg-warning",
    value: "var(--warning-500)",
  },
  {
    id: "color-bg-warning-hover",
    name: "color-bg-warning-hover",
    value: "var(--warning-600)",
  },
  {
    id: "color-bg-warning-active",
    name: "color-bg-warning-active",
    value: "var(--warning-700)",
  },
  {
    id: "color-bg-warning-muted",
    name: "color-bg-warning-muted",
    value: "var(--warning-200)",
  },

  {
    id: "color-bg-danger",
    name: "color-bg-danger",
    value: "var(--danger-500)",
  },
  {
    id: "color-bg-danger-hover",
    name: "color-bg-danger-hover",
    value: "var(--danger-600)",
  },
  {
    id: "color-bg-danger-active",
    name: "color-bg-danger-active",
    value: "var(--danger-700)",
  },
  {
    id: "color-bg-danger-muted",
    name: "color-bg-danger-muted",
    value: "var(--danger-200)",
  },
  {
    id: "color-bg-info",
    name: "color-bg-info",
    value: "var(--info-500)",
  },
  {
    id: "color-bg-info-hover",
    name: "color-bg-info-hover",
    value: "var(--info-600)",
  },
  {
    id: "color-bg-info-active",
    name: "color-bg-info-active",
    value: "var(--info-700)",
  },
  {
    id: "color-bg-info-muted",
    name: "color-bg-info-muted",
    value: "var(--info-200)",
  },

  {
    id: "color-bg-accent",
    name: "color-bg-accent",
    value: "var(--accent-500)",
  },
  {
    id: "color-bg-accent-hover",
    name: "color-bg-accent-hover",
    value: "var(--accent-600)",
  },
  {
    id: "color-bg-accent-active",
    name: "color-bg-accent-active",
    value: "var(--accent-700)",
  },
  {
    id: "color-bg-accent-muted",
    name: "color-bg-accent-muted",
    value: "var(--accent-200)",
  },
  {
    id: "color-bg-accent-muted-hover",
    name: "color-bg-accent-muted-hover",
    value: "var(--accent-300)",
  },

  {
    id: "color-fg",
    name: "color-fg",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-fg-muted",
    name: "color-fg-muted",
    value: "var(--neutral-800)",
  },
  {
    id: "color-fg-inverse",
    name: "color-fg-inverse",
    value: "var(--neutral-100)",
  },
  {
    id: "color-fg-disabled",
    name: "color-fg-disabled",
    value: "var(--neutral-500)",
  },
  {
    id: "color-fg-danger",
    name: "color-fg-danger",
    value: "var(--danger-700)",
  },
  {
    id: "color-fg-warning",
    name: "color-fg-warning",
    value: "var(--warning-700)",
  },
  {
    id: "color-fg-success",
    name: "color-fg-success",
    value: "var(--success-700)",
  },
  {
    id: "color-fg-info",
    name: "color-fg-info",
    value: "var(--info-700)",
  },
  {
    id: "color-fg-accent",
    name: "color-fg-accent",
    value: "var(--accent-700)",
  },

  {
    id: "color-fg-onNeutral",
    name: "color-fg-onNeutral",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-fg-onPrimary",
    name: "color-fg-onPrimary",
    value: "var(--neutral-100)",
  },
  {
    id: "color-fg-onAccent",
    name: "color-fg-onAccent",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-fg-onSuccess",
    name: "color-fg-onSuccess",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-fg-onDanger",
    name: "color-fg-onDanger",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-fg-onWarning",
    name: "color-fg-onWarning",
    value: "var(--neutral-1000)",
  },
  {
    id: "color-fg-onInfo",
    name: "color-fg-onInfo",
    value: "var(--neutral-1000)",
  },

  {
    id: "color-border",
    name: "color-border",
    value: "var(--neutral-300)",
  },
  {
    id: "color-border-hover",
    name: "color-border-hover",
    value: "var(--neutral-400)",
  },
  {
    id: "color-border-field",
    name: "color-border-field",
    value: "var(--neutral-400)",
  },
  {
    id: "color-border-control",
    name: "color-border-control",
    value: "var(--neutral-700)",
  },
  {
    id: "color-border-disabled",
    name: "color-border-disabled",
    value: "var(--neutral-300)",
  },
  {
    id: "color-border-focus",
    name: "color-border-focus",
    value: "var(--accent-500)",
  },

  {
    id: "color-border-success",
    name: "color-border-success",
    value: "var(--success-300)",
  },
  {
    id: "color-border-accent",
    name: "color-border-accent",
    value: "var(--accent-300)",
  },
  {
    id: "color-border-danger",
    name: "color-border-danger",
    value: "var(--danger-300)",
  },
  {
    id: "color-border-warning",
    name: "color-border-warning",
    value: "var(--warning-300)",
  },
  {
    id: "color-border-info",
    name: "color-border-info",
    value: "var(--info-300)",
  },
];

export const DEFAULT_STYLES: Omit<
  z.infer<typeof createStyleSchema>,
  "userId"
>[] = [
  {
    name: "Minimalist",
    slug: "minimalist",
    description: "",
    theme: {
      colors: {
        modes: [
          {
            mode: "light",
            lightness: 97,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                colorKeys: [{ id: 0, color: "#000000" }],
                ratios: [
                  1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                colorKeys: [{ id: 0, color: "#1A9338" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                colorKeys: [{ id: 0, color: "#E79D13" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                colorKeys: [{ id: 0, color: "#D93036" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
          {
            mode: "dark",
            lightness: 3,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                colorKeys: [{ id: 0, color: "#ffffff" }],
                ratios: [
                  1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                colorKeys: [{ id: 0, color: "#1A9338" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                colorKeys: [{ id: 0, color: "#E79D13" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                colorKeys: [{ id: 0, color: "#D93036" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
        ],
        tokens: DEFAULT_COLOR_TOKENS,
      },
      radius: 1,
      spacing: 0.25,
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      letterSpacing: 0,
      backgroundPattern: "none",
      texture: "none",
      shadows: {
        color: "#000000",
        opacity: 0.1,
        blurRadius: 10,
        offsetX: 0,
        offsetY: 1,
        spread: 0,
      },
    },
    icons: {
      library: "lucide",
      strokeWidth: 1.5,
    },
    variants: {
      alert: "basic",
      buttons: "basic",
      loader: "ring",
      "focus-style": "basic",
      inputs: "basic",
      pickers: "basic",
      selection: "basic",
      calendars: "basic",
      "list-box-and-menu": "basic",
      overlays: "basic",
      checkboxes: "basic",
      radios: "basic",
      switch: "basic",
      slider: "basic",
      "badge-and-tag-group": "basic",
      tooltip: "basic",
    },
  },
  {
    name: "Brutalist",
    slug: "brutalist",
    description: "",
    theme: {
      colors: {
        modes: [
          {
            mode: "light",
            lightness: 97,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                colorKeys: [{ id: 0, color: "#000000" }],
                ratios: [
                  1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                colorKeys: [{ id: 0, color: "#1A9338" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                colorKeys: [{ id: 0, color: "#E79D13" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                colorKeys: [{ id: 0, color: "#D93036" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
        ],
        tokens: DEFAULT_COLOR_TOKENS,
      },
      radius: 1,
      spacing: 0.25,
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      letterSpacing: 0,
      backgroundPattern: "none",
      texture: "none",
      shadows: {
        color: "#000000",
        opacity: 0.1,
        blurRadius: 10,
        offsetX: 0,
        offsetY: 1,
        spread: 0,
      },
    },
    icons: {
      library: "lucide",
      strokeWidth: 1.5,
    },
    variants: {
      buttons: "brutalist",
    },
  },
  {
    name: "Material",
    slug: "material",
    description: "",
    theme: {
      colors: {
        modes: [
          {
            mode: "light",
            lightness: 97,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                colorKeys: [{ id: 0, color: "#000000" }],
                ratios: [
                  1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                colorKeys: [{ id: 0, color: "#1A9338" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                colorKeys: [{ id: 0, color: "#E79D13" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                colorKeys: [{ id: 0, color: "#D93036" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
        ],
        tokens: DEFAULT_COLOR_TOKENS,
      },
      radius: 1,
      spacing: 0.25,
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      letterSpacing: 0,
      backgroundPattern: "none",
      texture: "none",
      shadows: {
        color: "#000000",
        opacity: 0.1,
        blurRadius: 10,
        offsetX: 0,
        offsetY: 1,
        spread: 0,
      },
    },
    icons: {
      library: "lucide",
      strokeWidth: 1.5,
    },
    variants: {
      buttons: "ripple",
    },
  },
  {
    name: "Ghibli",
    slug: "ghibli",
    description: "A Ghibli style.",
    theme: {
      colors: {
        modes: [
          {
            mode: "light",
            lightness: 97,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                colorKeys: [{ id: 0, color: "#f1dfbe" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                colorKeys: [{ id: 0, color: "#969A54" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                colorKeys: [{ id: 0, color: "#1A9338" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                colorKeys: [{ id: 0, color: "#E79D13" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                colorKeys: [{ id: 0, color: "#D93036" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                colorKeys: [{ id: 0, color: "#0091FF" }],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
        ],
        tokens: DEFAULT_COLOR_TOKENS,
      },
      radius: 1,
      spacing: 0.25,
      fonts: {
        heading: "Inter",
        body: "Poppins",
      },
      letterSpacing: 0,
      backgroundPattern: "none",
      texture: "none",
      shadows: {
        color: "#000000",
        opacity: 0.1,
        blurRadius: 10,
        offsetX: 0,
        offsetY: 1,
        spread: 0,
      },
    },
    icons: {
      library: "lucide",
      strokeWidth: 1.5,
    },
    variants: {},
  },
];
