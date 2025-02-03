import {
  ExtendedConfig,
  extendedConfigSchema,
  RawConfig,
  rawConfigSchema,
} from "@dotui/schemas";
import { cosmiconfig } from "cosmiconfig";
import path from "path";
import { loadConfig } from "tsconfig-paths";
import { resolveImport } from "@/utils";

export const DEFAULT_STYLE = "default";
export const DEFAULT_COMPONENTS = "@/components";
export const DEFAULT_UTILS = "@/lib/utils";
export const DEFAULT_TAILWIND_CSS = "app/globals.css";
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.js";
export const DEFAULT_TAILWIND_BASE_COLOR = "slate";

const explorer = cosmiconfig("config", {
  searchPlaces: ["dotui.json"],
});

export async function getConfig(cwd: string): Promise<ExtendedConfig | null> {
  const configResult = await explorer.search(cwd);

  if (!configResult) {
    throw new Error("Failed to load config.");
  }

  rawConfigSchema.parse(configResult.config);

  return await resolveConfigPaths(cwd, configResult.config);
}

export async function resolveConfigPaths(
  cwd: string,
  config: RawConfig
): Promise<ExtendedConfig> {
  const tsConfig = loadConfig(cwd);

  if (tsConfig.resultType === "failed") {
    throw new Error(
      `Failed to load tsconfig.json. ${tsConfig.message ?? ""}`.trim()
    );
  }

  return extendedConfigSchema.parse({
    ...config,
    resolvedPaths: {
      cwd,
      css: path.resolve(cwd, config.css),
      core: await resolveImport(config.aliases["core"], tsConfig),
      components: await resolveImport(config.aliases["components"], tsConfig),
      hooks: await resolveImport(config.aliases["hooks"], tsConfig),
      lib: await resolveImport(config.aliases["lib"], tsConfig),
    },
  });
}
