import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@dotui/eslint-config/base";
import { nextjsConfig } from "@dotui/eslint-config/nextjs";
import { reactConfig } from "@dotui/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
