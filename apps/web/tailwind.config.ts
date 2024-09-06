import type { Config } from "tailwindcss";
import baseConfig from "../../tailwind.config";

const config = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    "content/**/*.mdx",
    "registry/**/*.{ts,tsx}",
  ],
} satisfies Config;

export default config;
