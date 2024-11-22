import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["src/**/*.{ts,tsx}", "content/**/*.{ts,tsx,mdx}"],
  prefix: "",
  theme: {
    data: {
      mobile: 'mobile~="true"',
    },
  },
} satisfies Config;

export default config;
