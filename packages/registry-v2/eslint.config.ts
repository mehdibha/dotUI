import { baseConfig, restrictEnvAccess } from "@dotui/eslint-config/base";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: ["script/**"],
  },
  baseConfig,
  restrictEnvAccess,
);
