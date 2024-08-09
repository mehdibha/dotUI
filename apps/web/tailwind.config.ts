import baseConfig from "../../tailwind.config"
import type { Config } from "tailwindcss";

const config = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    "content/**/*.mdx",
    "registry/**/*.{ts,tsx}",
  ],
} satisfies Config;

export default config;
