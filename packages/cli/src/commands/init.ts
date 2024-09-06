import { Command } from "commander";
import path from "path";
import { z } from "zod";
import { logger, highlight, spinner } from "@/utils";
import { getProjectInfo } from "@/helpers/get-project-info";
import { initOptionsSchema } from "./init.schema";
import prompts, { PromptObject } from "prompts";
import {
  getRegistryColorSystems,
  getRegistryIconLibrairies,
  getRegistryStyles,
  getRegistryThemes,
} from "@/helpers/registry";
import { rawConfigSchema } from "@/helpers/get-config";
import {
  DEFAULT_COMPONENTS_ALIAS,
  DEFAULT_HOOKS_ALIAS,
  DEFAULT_RSC,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_TAILWIND_PREFIX,
  DEFAULT_UTILS_ALIAS,
} from "@/constants/default-config";
import { BASE_URL } from "@/constants/config";
import { checkEmptyProject } from "@/helpers/checks";
import { createProject } from "@/helpers/create-project";
import fs from "fs-extra";
import * as ERRORS from "@/helpers/errors";
import { handleError } from "@/helpers/handle-error";

export const init = new Command()
  .name("init")
  .description("initialize your project and install required dependencies")
  .argument(
    "[components...]",
    "the components to add or a url to the component."
  )
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-d, --defaults,", "use default configuration.", false)
  .option("-f, --force", "force overwrite of existing configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-s, --silent", "mute output.", false)
  .action(async (components, opts) => {
    try {
      const options = initOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        isNewProject: false,
        components,
        ...opts,
      });

      await runInit(options);

      logger.log(
        `${highlight.success(
          "Success!"
        )} Project initialization completed.\nYou may now add components.`
      );
      logger.break();
    } catch (error) {
      logger.break();
      handleError(error);
    }
  });

async function runInit(options: z.infer<typeof initOptionsSchema>) {
  // We check if project exists
  const emptyProject = checkEmptyProject(options.cwd);
  if (emptyProject) {
    const { projectPath } = await createProject(options);
    if (!projectPath) {
      process.exit(1);
    }
    options.cwd = projectPath;
    options.isNewProject = true;
  }

  // No need to run init checks if it's a new project.
  if (!options.isNewProject) {
    await initChecks(options);
  }

  const config = await promptForConfig(options);

  if (!options.yes) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Write configuration to ${highlight.info(
        "dotui.config.json"
      )}. Proceed?`,
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  // Write dotui.config.json.
  const configSpinner = spinner(`Writing dotui.config.json.`).start()
  const targetPath = path.resolve(options.cwd, "dotui.config.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  configSpinner.succeed()
}

const initChecks = async (options: z.infer<typeof initOptionsSchema>) => {
  let errors: Record<string, boolean> = {};

  // We check if a config file already exists
  const checksSpinner = spinner(`Verifying your project config.`, {
    silent: options.silent,
  }).start();
  if (
    fs.existsSync(path.resolve(options.cwd, "dotui.config.json")) &&
    !options.force
  ) {
    checksSpinner?.fail()
    const { proceed } = await prompts({
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

    fs.removeSync(path.resolve(options.cwd, "dotui.config.json"));
  }
  checksSpinner?.succeed();

  // We check the framework
  const frameworkSpinner = spinner(`Verifying framework.`, {
    silent: options.silent,
  }).start();
  const projectInfo = await getProjectInfo(options.cwd);
  if (!projectInfo || projectInfo?.framework.name === "manual") {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true;
    frameworkSpinner?.fail();
    logger.break();
    if (projectInfo?.framework.links.installation) {
      logger.error(
        `We could not detect a supported framework at ${highlight.info(
          options.cwd
        )}.`
      );
    }
    logger.break();
    process.exit(1);
  }
  frameworkSpinner?.succeed(
    `Verifying framework. Found ${highlight.info(projectInfo.framework.label)}.`
  );

  // We check the tailwind configuration
  const tailwindSpinner = spinner(`Validating Tailwind CSS.`, {
    silent: options.silent,
  }).start();
  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    errors[ERRORS.TAILWIND_NOT_CONFIGURED] = true;
    tailwindSpinner?.fail();
  } else {
    tailwindSpinner?.succeed();
  }

  // We check the import alias
  const tsConfigSpinner = spinner(`Validating import alias.`, {
    silent: options.silent,
  }).start();
  if (!projectInfo?.aliasPrefix) {
    errors[ERRORS.IMPORT_ALIAS_MISSING] = true;
    tsConfigSpinner?.fail();
  } else {
    tsConfigSpinner?.succeed();
  }

  // Handle errors
  if (Object.keys(errors).length > 0) {
    if (errors[ERRORS.TAILWIND_NOT_CONFIGURED]) {
      logger.break();
      logger.error(
        `No Tailwind CSS configuration found at ${highlight.info(options.cwd)}.`
      );
      logger.error(
        `It is likely you do not have Tailwind CSS installed or have an invalid configuration.`
      );
      logger.error(`Install Tailwind CSS then try again.`);
    }

    if (errors[ERRORS.IMPORT_ALIAS_MISSING]) {
      logger.break();
      logger.error(`No import alias found in your tsconfig.json file.`);
    }

    logger.break();
    process.exit(1);
  }
};

const promptForConfig = async (opts: z.infer<typeof initOptionsSchema>) => {
  const [styles, iconLibraries, themes, colorSystems] = await Promise.all([
    getRegistryStyles(),
    getRegistryIconLibrairies(),
    getRegistryThemes(),
    getRegistryColorSystems(),
  ]);

  const projectInfo = await getProjectInfo(opts.cwd);

  const questions: (PromptObject & { skip?: boolean })[] = [
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${highlight.info(
        "TypeScript"
      )} (recommended)?`,
      initial: true,
      active: "yes",
      inactive: "no",
      skip: projectInfo !== null && projectInfo.isTsx !== null,
    },
    {
      type: "select",
      name: "style",
      message: `Which ${highlight.info("style")} would you like to use?`,
      choices: styles.map((style) => ({
        title: style.label,
        value: style.name,
      })),
    },
    {
      type: "select",
      name: "theme",
      message: `Which ${highlight.info("theme")} whould you like to install?`,
      choices: themes.map((theme) => ({
        title: theme.name,
        value: theme.name,
      })),
    },
    {
      type: "select",
      name: "iconLibrary",
      message: `Which ${highlight.info(
        "icon library"
      )} whould you like to use?`,
      choices: iconLibraries.map((iconLibrary) => ({
        title: iconLibrary.name,
        value: iconLibrary.name,
      })),
    },
    {
      type: "text",
      name: "tailwindCss",
      message: `Where is your ${highlight.info("global CSS")} file?`,
      initial: DEFAULT_TAILWIND_CSS,
      skip: projectInfo !== null && projectInfo.tailwindCssFile !== null,
    },
    {
      type: "select",
      name: "colorSystem",
      message: `Which ${highlight.info(
        "color system"
      )} would you like to use for theming?`,
      choices: colorSystems.map((style) => ({
        title: style.label,
        value: style.name,
      })),
    },
    {
      type: "text",
      name: "tailwindPrefix",
      message: `Are you using a custom ${highlight.info(
        "tailwind prefix eg. tw-"
      )}? (Leave blank if not)`,
      initial: DEFAULT_TAILWIND_PREFIX,
      skip: projectInfo !== null && projectInfo.aliasPrefix !== null,
    },
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlight.info("tailwind.config.js")} located?`,
      initial: DEFAULT_TAILWIND_CONFIG,
      skip: projectInfo !== null && projectInfo.tailwindConfigFile !== null,
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${highlight.info(
        "components"
      )}:`,
      initial: DEFAULT_COMPONENTS_ALIAS,
      skip: projectInfo !== null && projectInfo.aliasPrefix !== null,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${highlight.info("utils")}:`,
      initial: DEFAULT_UTILS_ALIAS,
      skip: projectInfo !== null && projectInfo.aliasPrefix !== null,
    },
    {
      type: "toggle",
      name: "rsc",
      message: `Are you using ${highlight.info("React Server Components")}?`,
      initial: DEFAULT_RSC,
      active: "yes",
      inactive: "no",
      skip: projectInfo !== null && projectInfo.isRSC !== null,
    },
  ];

  const options = await prompts(questions.filter((q) => !q.skip));
  logger.info("");

  return rawConfigSchema.parse({
    $schema: `${BASE_URL}/schema.json`,
    style: options.style,
    iconLibrary : options.iconLibrary,
    colorSystem: options.colorSystem,
    rsc: options.rsc ?? projectInfo?.isRSC ?? false,
    tsx: options.typescript ?? projectInfo?.isTsx ?? true,
    tailwind: {
      config: options.tailwindConfig ?? projectInfo?.tailwindConfigFile,
      css: options.tailwindCss ?? projectInfo?.tailwindCssFile,
      prefix: options.tailwindPrefix ?? "",
    },
    aliases: {
      components:
        options.components ??
        (projectInfo
          ? `${projectInfo.aliasPrefix}/components`
          : DEFAULT_COMPONENTS_ALIAS),
      utils:
        options.utils ??
        (projectInfo
          ? `${projectInfo.aliasPrefix}/utils`
          : DEFAULT_UTILS_ALIAS),
      lib:
        options.components ??
        (projectInfo
          ? `${projectInfo.aliasPrefix}/lib`
          : DEFAULT_COMPONENTS_ALIAS),
      hooks:
        options.utils ??
        (projectInfo
          ? `${projectInfo.aliasPrefix}/hooks`
          : DEFAULT_HOOKS_ALIAS),
    },
  });
};
