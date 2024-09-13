import { dirname, join, resolve } from "path";
import retry from "async-retry";
import { highlight, logger, spinner } from "@/utils";
import { getRegistryTemplate } from "./registry";
import {
  downloadAndExtractRepo,
  getRepoInfo,
  hasRepo,
  type RepoInfo,
} from "./templates";
import { isWriteable } from "./is-writable";
import { existsSync, mkdirSync } from "fs";
import { isFolderEmpty } from "./is-folder-empty";
import { installDeps } from "./install-deps";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
export class DownloadError extends Error {}

export const createTemplateProject = async ({
  template,
  templatePath,
  projectPath,
  packageManager,
  skipInstall,
}: {
  template: string;
  templatePath?: string;
  projectPath: string;
  packageManager: PackageManager;
  skipInstall: boolean;
}) => {
  let repoInfo: RepoInfo | undefined;
  let repoUrl: URL | undefined;
  let isUrl = false;
  try {
    repoUrl = new URL(template);
    isUrl = true;
  } catch (error) {
    const err = error as Error & { code: string | undefined };
    if (err.code !== "ERR_INVALID_URL") {
      logger.break();
      console.error(error);
      process.exit(1);
    } else {
      const templateInfo = await getRegistryTemplate(template)!;
      if (!templateInfo) {
        logger.break();
        logger.error(
          `Could not locate a template named ${highlight.error(
            `"${template}"`
          )}. It could be due to the following:\n`,
          `1. Your spelling of template ${highlight.error(
            `"${template}"`
          )} might be incorrect.\n`
        );
        process.exit(1);
      }
      try {
        repoUrl = new URL(templateInfo.githubUrl);
      } catch (error) {
        logger.break();
        logger.log(
          `Invalid URL at registry: ${highlight.error(
            `"${templateInfo.githubUrl}"`
          )}.`
        );
        process.exit(1);
      }
    }
  }

  if (repoUrl.origin !== "https://github.com") {
    logger.break();
    logger.log(
      `Invalid URL: ${highlight.error(
        `"${template}"`
      )}. Only GitHub repositories are supported. Please use a GitHub URL and try again.`
    );
    process.exit(1);
  }

  repoInfo = await getRepoInfo(repoUrl, templatePath);

  if (!repoInfo) {
    logger.log(
      `Found invalid GitHub URL: ${highlight.error(
        `"${template}"`
      )}. Please fix the URL and try again.`
    );
    process.exit(1);
  }

  const found = await hasRepo(repoInfo);

  if (!found) {
    logger.break();
    logger.log(
      `Could not locate the repository for ${highlight.error(
        `"${template}"`
      )}. Please check that the repository exists and try again.`
    );
    process.exit(1);
  }

  const root = resolve(projectPath);

  if (!(await isWriteable(dirname(root)))) {
    logger.break();
    logger.error(
      "The application path is not writable, please check folder permissions and try again."
    );
    logger.error(
      "It is likely you do not have write permissions for this folder."
    );
    process.exit(1);
  }

  mkdirSync(root, { recursive: true });
  if (!isFolderEmpty(root)) {
    process.exit(1);
  }

  process.chdir(root);

  const downloadSpinner = spinner(
    `Downloading files from ${isUrl ? "repo" : "template"} ${highlight.info(
      template
    )}. This might take a moment.`
  )?.start();

  try {
    await retry(() => downloadAndExtractRepo(root, repoInfo), {
      retries: 3,
    });
    downloadSpinner?.succeed();
  } catch (error) {
    downloadSpinner?.fail();
    logger.break();
    process.exit(1);
  }

  const packageJsonPath = join(root, "package.json");
  const hasPackageJson = existsSync(packageJsonPath);
  if (!skipInstall && hasPackageJson) {
    logger.log("Installing packages. This might take a couple of minutes.");
    await installDeps(packageManager);
  }
};
