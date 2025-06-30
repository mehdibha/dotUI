import baseConfig from "@dotui/eslint-config/base";
import reactConfig from "@dotui/eslint-config/react";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
