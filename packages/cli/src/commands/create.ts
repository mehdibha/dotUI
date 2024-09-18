import { runInit } from "@/commands/init";
import { handleError } from "@/helpers/handle-error";
import { highlight, logger } from "@/utils";
import { Command } from "commander";
import { z } from "zod";
import { basename, resolve } from "path";
import prompts from "prompts";
import { validateProjectName } from "@/helpers/validate-project-name";
import { existsSync, readdirSync } from "fs";
import ciInfo from "ci-info";
import { createTemplateProject } from "@/helpers/create-template";
import { getPackageManager } from "@/helpers/get-pkg-manager";
import { createProject } from "@/helpers/create-project";
import { onPromptState } from "@/helpers/on-prompt-state";

const createOptionsSchema = z.object({
  projectDir: z.string().optional(),
  template: z.string().optional(),
  skipInstall: z.boolean(),
  yes: z.boolean(),
});

export const createCommand = new Command()
  .name("create")
  .description("Create a new project")
  .argument("[projectDir]")
  .usage("[projectDir] [options]")
  .helpOption("-h, --help", "Display this help message.")
  .option("-y --yes", "use default options", false)
  .option("--skip-install", "skip install", false)
  .option(
    "-t --template <example-name|github-url>",
    `

    A template to bootstrap the app with. You can use a template name
    from the official dotUI templates (https://dotui.org/templates) or a public GitHub URL. The URL can use
    any branch and/or subdirectory.
    `
  )
  .action(async (projectDir, opts) => {
    try {
      const options = createOptionsSchema.parse(opts);
      const result = await runCreate({ projectDir, ...options });
      if (result) {
        logger.break();
        await runInit({
          projectDir: result.appPath,
          yes: options.yes,
          skipInstall: options.skipInstall,
        });
        logger.log(
          `${highlight.success("Success!")} Created ${result.appName} at ${result.appPath}.`
        );
        logger.break();
        logger.log(
          `You may now add components, hooks, and more using the \`add\` command.`
        );
        logger.break();
        logger.log(`We suggest that you begin by typing:`);
        logger.break();
        logger.success("  npx dotui@latest add button");
      }
    } catch (error) {
      logger.break();
      handleError(error);
    }
  });

const runCreate = async (options: z.infer<typeof createOptionsSchema>) => {
  let createOptions: Record<string, any> = {};
  let projectPath: string = "";

  projectPath = options?.projectDir ?? "";

  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }
  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: "text",
      name: "path",
      message: "What is your project named?",
      initial: "my-app",
      validate: (name) => {
        const validation = validateProjectName(basename(resolve(name)));
        if (validation.valid) {
          return true;
        }
        return "Invalid project name: " + validation.errors[0];
      },
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  const appPath = resolve(projectPath);
  const appName = basename(appPath);

  const validation = validateProjectName(appName);
  if (!validation.valid) {
    logger.error("Invalid project name: " + validation.errors[0]);
    process.exit(1);
  }

  if (existsSync(appPath) && !(readdirSync(appPath).length === 0)) {
    logger.error(
      `The directory ${appName} is not empty. Please provide a new directory name, or remove the files listed above.`
    );
    process.exit(1);
  }

  const template =
    typeof options.template === "string" && options.template.trim();

  const skipPrompt = ciInfo.isCI || options.yes;

  const packageManager = await getPackageManager(appPath, {
    withFallback: true,
  });

  if (template) {
    await createTemplateProject({
      template,
      projectPath,
      packageManager,
      skipInstall: options?.skipInstall ?? false,
    });
    return;
  }

  const defaultCreateOptions = {
    framework: "nextjs",
    typescript: true,
    srcDir: true,
    importAlias: "@/*",
  };

  if (!skipPrompt) {
    const { framework, typescript, srcDir, importAlias } = await prompts([
      {
        onState: onPromptState,
        type: "select",
        name: "framework",
        message: "What framework would you like to use?",
        choices: [{ title: "Next.js", value: "nextjs" }],
      },
      {
        onState: onPromptState,
        type: "toggle",
        name: "typescript",
        message: `Would you like to use ${highlight.info("TypeScript")}?`,
        initial: defaultCreateOptions.typescript,
        active: "Yes",
        inactive: "No",
      },
      {
        onState: onPromptState,
        type: "toggle",
        name: "srcDir",
        message: `Would you like to use ${highlight.info("src/")} directory?`,
        initial: defaultCreateOptions.srcDir,
        active: "Yes",
        inactive: "No",
      },
      {
        onState: onPromptState,
        type: "text",
        name: "importAlias",
        message: `What is your ${highlight.info("import")} alias?`,
        initial: defaultCreateOptions.importAlias,
      },
    ]);
    createOptions.framework = framework;
    createOptions.typescript = typescript;
    createOptions.srcDir = srcDir;
    createOptions.importAlias = importAlias;
  }

  createOptions = {
    ...defaultCreateOptions,
    ...createOptions,
  };

  const parsedOptions = createProjectOptionsSchema.parse({
    ...createOptions,
    packageManager,
    skipInstall: options.skipInstall,
  });

  await createProject(appPath, {
    framework: parsedOptions.framework,
    typescript: parsedOptions.typescript,
    srcDir: parsedOptions.srcDir,
    importAlias: parsedOptions.importAlias,
    packageManager,
    skipInstall: parsedOptions.skipInstall,
  });

  return { appName, appPath };
};

const createProjectOptionsSchema = z.object({
  framework: z.enum(["nextjs"]),
  typescript: z.boolean(),
  srcDir: z.boolean(),
  importAlias: z.string(),
  packageManager: z.enum(["npm", "yarn", "pnpm", "bun"]),
  skipInstall: z.boolean(),
});
