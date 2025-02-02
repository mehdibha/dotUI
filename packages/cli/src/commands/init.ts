import * as p from "@clack/prompts";
import type { RegistryTheme } from "@dotui/registry";
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { addPrimitives } from "@/helpers/add-primitives";
import { Config, RawConfig, resolveConfigPaths } from "@/helpers/get-config";
import { handleError } from "@/helpers/handle-error";
import { initChecks } from "@/helpers/init-checks";
import { getRegistryTheme, getRegistryThemes } from "@/helpers/registry-api";
import { Aliases } from "@/types";
import { c } from "@/utils";

export const initCommand = new Command()
  .name("init")
  .description("initialize your project and install required dependencies")
  .argument("[themeId]")
  .usage("[themeId] [options]")
  .helpOption("-h, --help", "show all available options")
  .option("-y --yes", "use default options", false)
  .option(
    "-d --dir",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(
    async (
      themeId: string | undefined,
      options: { yes: boolean; dir: string }
    ) => {
      try {
        p.intro("Initializing dotUI in your project.");
        await initChecks(options);
        const aliases = await getOrPromptForAlias();
        themeId = await getOrPromptForThemeId(themeId);
        const theme = await getRegistryTheme(themeId);
        const config = await createConfigFile(options.dir, aliases, theme);
        await addPrimitives(["base"], config, {
          overwrite: true,
          message: "Updating your project",
        });
        p.outro(
          `${c.success("Project initialized successfully.")}\n\nYou may know add components: ${c.info("npx dotui-cli add button")}`
        );
      } catch (error) {
        p.outro(
          c.error(
            "Someting went wrong. If the problem persists, please open an issue on GitHub."
          )
        );
        handleError(error);
      }
    }
  );

const getOrPromptForAlias = async () => {
  const customizeAlias = await p.confirm({
    message: "Would you like to customize the import alias?",
    initialValue: false,
  });

  if (p.isCancel(customizeAlias)) {
    p.cancel("Project init cancelled.");
    process.exit(0);
  }

  let alias = {
    components: "@/components",
    core: "@/components/core",
    hooks: "@/hooks",
    lib: "@/lib",
    utils: "@/lib/utils",
  };

  if (customizeAlias) {
    alias = await p.group(
      {
        components: () =>
          p.text({
            message: `Configure the import alias for ${c.info("components")}:`,
            placeholder: "@/components",
          }),
        core: () =>
          p.text({
            message: `Configure the import alias for ${c.info("core components")}:`,
            placeholder: "@/components/core",
          }),
        hooks: () =>
          p.text({
            message: `Configure the import alias for ${c.info("hooks")}:`,
            placeholder: "@/hooks",
          }),
        lib: () =>
          p.text({
            message: `Configure the import alias for ${c.info("lib")}:`,
            placeholder: "@/lib",
          }),
        utils: () =>
          p.text({
            message: `Configure the import alias for ${c.info("utils")}:`,
            placeholder: "@/lib/utils",
          }),
      },
      {
        onCancel: () => {
          p.cancel("Project init cancelled.");
          process.exit(0);
        },
      }
    );
  }

  return alias;
};

async function getOrPromptForThemeId(argumentThemeId: string | undefined) {
  if (argumentThemeId) return argumentThemeId;

  const themes = await getRegistryThemes();

  const themeId = await p.select({
    message: "Select a theme:",
    options: themes.map((theme) => ({
      value: theme.id,
      label: theme.label,
    })),
  });

  if (p.isCancel(themeId)) {
    p.cancel("Project init cancelled.");
    process.exit(1);
  }

  return themeId;
}

async function createConfigFile(
  cwd: string,
  aliases: Aliases,
  theme: RegistryTheme
): Promise<Config> {
  const proceed = await p.confirm({
    message: `Write configuration to ${c.info("dotui.json")}. Proceed?`,
  });

  if (p.isCancel(proceed)) {
    p.cancel("Project init cancelled.");
    process.exit(0);
  }

  // Write config file
  const createConfigSpinner = p.spinner();
  createConfigSpinner.start("Creating configuration file");
  const targetPath = path.resolve(cwd, "dotui.json");
  const rawConfig: RawConfig = {
    $schema: "http://localhost:3000/schema.json", // TODO update this
    css: "app/globals.css", // TODO FIX THIS
    aliases: aliases,
    iconLibrary: theme.iconLibrary,
    primitives: theme.primitives,
  };
  if (fs.existsSync(targetPath)) {
    await fs.remove(targetPath);
  }
  await fs.writeFile(targetPath, JSON.stringify(rawConfig, null, 2), "utf8");

  const config = await resolveConfigPaths(cwd, rawConfig);
  createConfigSpinner.stop("Created configuration file");
  return config;
}
