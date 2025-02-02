import { cosmiconfig } from "cosmiconfig";
import path from "path";
import { loadConfig } from "tsconfig-paths";
import { z } from "zod";
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

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    css: z.string(),
    aliases: z.object({
      core: z.string(),
      components: z.string(),
      lib: z.string(),
      hooks: z.string(),
      utils: z.string(),
    }),
    iconLibrary: z.string().optional(),
    primitives: z.record(z.string(), z.string()).optional(),
  })
  .strict();

export type RawConfig = z.infer<typeof rawConfigSchema>;

export const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    cwd: z.string(),
    css: z.string(),
    core: z.string(),
    components: z.string(),
    hooks: z.string(),
    lib: z.string(),
    utils: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>;

export async function getConfig(cwd: string): Promise<Config | null> {
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
): Promise<Config> {
  const tsConfig = loadConfig(cwd);

  if (tsConfig.resultType === "failed") {
    throw new Error(
      `Failed to load tsconfig.json. ${tsConfig.message ?? ""}`.trim()
    );
  }

  return configSchema.parse({
    ...config,
    resolvedPaths: {
      cwd,
      css: path.resolve(cwd, config.css),
      core: await resolveImport(config.aliases["core"], tsConfig),
      components: await resolveImport(config.aliases["components"], tsConfig),
      utils: await resolveImport(config.aliases["utils"], tsConfig),
      hooks: await resolveImport(config.aliases["hooks"], tsConfig),
      lib: await resolveImport(config.aliases["lib"], tsConfig),
    },
  });
}
