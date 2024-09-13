import { join, resolve } from "path";
import { logger, spinner } from "@/utils";
import { execa } from "execa";
import { existsSync } from "fs";
import { installDeps } from "./install-deps";

type Framework = "nextjs" | "remix" | "vite" | "astro";
type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
export class DownloadError extends Error {}

type CreateProjectOptions = {
  framework: Framework;
  packageManager: PackageManager;
  typescript: boolean;
  srcDir: boolean;
  importAlias: string;
  skipInstall: boolean;
};

const frameworks = [{ name: "nextjs", label: "Next.js" }];

export const createProject = async (
  projectPath: string,
  options: CreateProjectOptions
) => {
  const {
    framework,
    packageManager,
    typescript,
    srcDir,
    importAlias,
    skipInstall,
  } = options;

  logger.break()
  const createSpinner = spinner(
    `Creating a new ${
      frameworks.find((el) => el.name === framework)?.label
    } project. This may take a few minutes.`
  ).start();

  try {
    if (framework === "nextjs") {
      await createNextProject(projectPath, {
        typescript,
        srcDir,
        packageManager,
      });
    }
    // if (framework === "vite") {
    //   await createViteProject(options.cwd, {
    //     name,
    //     ts: true,
    //     srcDir: options.srcDir ?? true,
    //     packageManager,
    //   });
    //   createSpinner?.succeed("Creating a new vite project.");
    // }
    createSpinner?.succeed();
  } catch (error) {
    createSpinner?.fail();
    logger.log(`Failed to create project: ${error}`);
    process.exit(1);
  }
  const root = resolve(projectPath);
  process.chdir(root);
  const packageJsonPath = join(projectPath, "package.json");
  const hasPackageJson = existsSync(packageJsonPath);
  if (!skipInstall && hasPackageJson) {
    logger.break()
    logger.log("Installing packages. This might take a couple of minutes.");
    await installDeps(packageManager);
  }
};

const createNextProject = async (
  projectPath: string,
  options: {
    typescript: boolean;
    srcDir: boolean;
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
  }
) => {
  const args = [
    projectPath,
    "--tailwind",
    "--eslint",
    "--typescript",
    "--app",
    options.srcDir ? "--src-dir" : "--no-src-dir",
    "--no-import-alias",
    // "--import-alias <alias-to-configure>", // TODO: add this feature
    `--use-${options.packageManager}`,
    "--skip-install",
  ];
  await execa("npx", ["create-next-app@latest", ...args], {
    cwd: process.cwd(),
  });
};