import baseConfig from "@dotui/eslint-config/base";
import reactConfig from "@dotui/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
