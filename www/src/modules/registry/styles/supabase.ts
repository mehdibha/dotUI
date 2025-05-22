import { createStyle } from "@/modules/styles/lib/create-style";
import { Style } from "@/modules/styles/types";

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
          ratios: [1, 1.08, 1.4, 2, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        },
        accent: {
          baseColors: ["#00623A"],
        },
      },
      lightness: 4,
    },
  },
});
