import baseConfig, { restrictEnvAccess } from "@dotui/eslint-config/base";
import nextjsConfig from "@dotui/eslint-config/nextjs";
import reactConfig from "@dotui/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];