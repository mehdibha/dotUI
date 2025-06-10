import { createStyle } from "@/modules/styles/lib/create-style";
import type { Style } from "@/modules/styles/types";

export const supabaseTheme: Style = createStyle({
  name: "supabase",
  label: "Supabase",
  icon: "SupabaseIcon",
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  theme: {
    light: {
      colors: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#00623A"],
        },
      },
    },
    dark: {
      colors: {
        neutral: {
          baseColors: ["#121212"],
          ratios: [1, 1.08, 1.5, 2, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        },
        accent: {
          baseColors: ["#00623A"],
          ratios: [1.25, 1.5, 1.8, 2.23, 3, 4.5, 6, 7, 13.2, 15.2],
        },
      },
      lightness: 4,
    },
    theme: {
      "color-border-accent": "var(--accent-400)",
      "color-border-accent-hover": "var(--accent-500)",
      "color-border-success": "var(--success-400)",
      "color-border-success-hover": "var(--success-500)",
      "color-border-warning": "var(--warning-400)",
      "color-border-warning-hover": "var(--warning-500)",
      "color-border-danger": "var(--danger-400)",
      "color-border-danger-hover": "var(--danger-500)",
    },
  },
  components: {
    button: "outline",
  },
});
