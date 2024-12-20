import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { z } from "zod";
import { BASE_URL } from "@/constants/config";
import {
  DEFAULT_COMPONENTS_ALIAS,
  DEFAULT_CORE_ALIAS,
  DEFAULT_HOOKS_ALIAS,
  DEFAULT_UTILS_ALIAS,
} from "@/constants/default-config";
import { addComponents } from "@/helpers/add-components";
import {
  Config,
  rawConfigSchema,
  resolveConfigPaths,
} from "@/helpers/get-config";
import { getProjectInfo } from "@/helpers/get-project-info";
import { handleError } from "@/helpers/handle-error";
import { isEmptyProject } from "@/helpers/is-empty-project";
import { onPromptState } from "@/helpers/on-prompt-state";
import {
  getRegistryColorSystems,
  getRegistryIconLibrairies,
  getRegistryStyles,
  getRegistryThemes,
} from "@/helpers/registry";
import { logger, highlight, spinner } from "@/utils";

const initOptionsSchema = z.object({
  projectDir: z.string().optional(),
  yes: z.boolean(),
  skipInstall: z.boolean(),
});

export const init = new Command()
  .name("init")
  .description("initialize your project and install required dependencies")
  .argument("[projectDir]")
  .usage("[projectDir] [options]")
  .helpOption("-h, --help", "Display this help message.")
  .option("-y --yes", "use default options", false)
  .option("--skip-install", "skip install", false)
  .action(async (projectDir, opts) => {
    try {
      logger.log(
        `${highlight.warn("⚠️  dotui-cli is still under development.")}`
      );
      logger.log(`You can follow the progress on https://x.com/mehdibha_.`);
      logger.break();
      return;
      const options = initOptionsSchema.parse({ projectDir, ...opts });
      await runInit(options);
      logger.log(
        `${highlight.success("Success!")} Project initialization completed.`
      );
      logger.break();
      logger.log(
        `You may now add components, hooks, and more using the \`add\` command.`
      );
      logger.break();
      logger.log(`We suggest that you begin by typing:`);
      logger.break();
      logger.success("  npx dotui-cli@latest add button");
    } catch (error) {
      logger.break();
      handleError(error);
    }
  });

export async function runInit(options: z.infer<typeof initOptionsSchema>) {
  let projectDir = options.projectDir ?? process.cwd();
  const emptyProject = isEmptyProject(projectDir);
  if (emptyProject) {
    logger.log(
      `We could not find a project at ${highlight.error(projectDir)}.`
    );
    logger.break();
    process.exit(1);
  }

  // We check if a config file already exists
  const configPath = path.resolve(projectDir, "dotui.config.json");
  const checkConfigSpinner = spinner(`Verifying your project config.`).start();
  if (fs.existsSync(configPath) && !options.yes) {
    {
      checkConfigSpinner?.fail();
      const { proceed } = await prompts({
        onState: onPromptState,
        type: "confirm",
        name: "proceed",
        message: `A ${highlight.info(
          "dotui.config.json"
        )} file already exists.\nDo you want to overwrite it?`,
        initial: false,
      });
      if (!proceed) {
        process.exit(1);
      }
      fs.removeSync(configPath);
    }
  }
  checkConfigSpinner?.succeed();

  // We check the framework
  const frameworkSpinner = spinner(`Verifying framework.`).start();
  const projectInfo = await getProjectInfo(projectDir);
  if (!projectInfo || projectInfo?.framework.name === "manual") {
    frameworkSpinner?.fail();
    logger.break();
    logger.error(
      `We could not detect a supported framework at ${highlight.info(
        projectDir
      )}.`
    );
    logger.break();
    process.exit(1);
  }
  frameworkSpinner?.succeed(
    `Verifying framework. Found ${highlight.info(projectInfo.framework.label)}.`
  );

  // We check the tailwind configuration
  const tailwindSpinner = spinner(`Validating Tailwind CSS.`).start();
  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    tailwindSpinner?.fail();
    logger.break();
    logger.error(
      `No Tailwind CSS configuration found at ${highlight.info(projectDir)}.`
    );
    logger.error(
      `It is likely you do not have Tailwind CSS installed or have an invalid configuration.`
    );
    logger.error(`Install Tailwind CSS then try again.`);
    logger.break();
    process.exit(1);
  } else {
    tailwindSpinner?.succeed();
  }

  // We check the import alias
  const tsConfigSpinner = spinner(`Validating import alias.`).start();
  if (!projectInfo?.aliasPrefix) {
    tsConfigSpinner?.fail();
    logger.break();
    logger.error(`No import alias found in your tsconfig.json file.`);
    logger.break();
    process.exit(1);
  } else {
    tsConfigSpinner?.succeed();
  }

  logger.break();

  // const { config, theme } = await promptForConfig({
  //   projectDir,
  //   yes: options.yes,
  //   skipInstall: options.skipInstall,
  // });

  // // Write dotui.config.json.
  // const configSpinner = spinner(`Writing dotui.config.json.`).start();
  // const targetPath = path.resolve(projectDir, "dotui.config.json");
  // await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8");
  // configSpinner.succeed();

  // const fullConfig = await resolveConfigPaths(projectDir, config);
  // await addComponents(["index", theme.name], fullConfig, {});
}

const promptForConfig = async (opts: {
  projectDir: string;
  yes: boolean;
  skipInstall: boolean;
}) => {
  const [
    styles,
    //  iconLibraries,
    //  themes,
    // colorSystems
  ] = await Promise.all([
    getRegistryStyles(),
    getRegistryIconLibrairies(),
    // getRegistryThemes(),
    // getRegistryColorSystems(),
  ]);

  // const projectInfo = await getProjectInfo(opts.projectDir);

  // const options = await prompts([
  //   {
  //     type: "select",
  //     name: "style",
  //     message: `Which ${highlight.info("style")} would you like to use?`,
  //     choices: styles.map((style) => ({
  //       title: style.label ?? style.name,
  //       value: style.name,
  //     })),
  //     onState: onPromptState,
  //   },
  //   {
  //     type: "select",
  //     name: "theme",
  //     message: `Which ${highlight.info("theme")} whould you like to install?`,
  //     choices: themes.map((theme) => ({
  //       title: theme.name,
  //       value: theme.label,
  //     })),
  //     onState: onPromptState,
  //   },
  //   {
  //     type: "select",
  //     name: "iconLibrary",
  //     message: `Which ${highlight.info(
  //       "icon library"
  //     )} whould you like to use?`,
  //     choices: iconLibraries.map((iconLibrary) => ({
  //       title: iconLibrary.name,
  //       value: iconLibrary.label,
  //     })),
  //     onState: onPromptState,
  //   },
  //   {
  //     type: "select",
  //     name: "colorSystem",
  //     message: `Which ${highlight.info(
  //       "color system"
  //     )} would you like to use for theming?`,
  //     choices: colorSystems.map((style) => ({
  //       title: style.label,
  //       value: style.name,
  //     })),
  //     onState: onPromptState,
  //   },
  // ]);

  // logger.info("");

  // const config : Config = {
  //   $schema: `${BASE_URL}/schema.json`,
  //   style: options.style,
  //   iconLibrary: options.iconLibrary,
  //   colorSystem: options.colorSystem,
  //   rsc: projectInfo?.isRSC,
  //   tsx: projectInfo?.isTsx ?? true,
  //   tailwind: {
  //     config: projectInfo?.tailwindConfigFile,
  //     css: projectInfo?.tailwindCssFile,
  //     prefix: "",
  //   },
  //   aliases: {
  //     core: projectInfo?.aliasPrefix
  //       ? `${projectInfo.aliasPrefix}/components/core`
  //       : DEFAULT_CORE_ALIAS,
  //     components: projectInfo?.aliasPrefix
  //       ? `${projectInfo.aliasPrefix}/components`
  //       : DEFAULT_COMPONENTS_ALIAS,
  //     utils: projectInfo?.aliasPrefix
  //       ? `${projectInfo.aliasPrefix}/utils`
  //       : DEFAULT_UTILS_ALIAS,
  //     lib: projectInfo?.aliasPrefix
  //       ? `${projectInfo.aliasPrefix}/lib`
  //       : DEFAULT_COMPONENTS_ALIAS,
  //     hooks: projectInfo?.aliasPrefix
  //       ? `${projectInfo.aliasPrefix}/hooks`
  //       : DEFAULT_HOOKS_ALIAS,
  //   },
  // }

  // console.log(config)

  // return {
  //   config: rawConfigSchema.parse(config),
  //   theme: options.theme,
  // };
};
