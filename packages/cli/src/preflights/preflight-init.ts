import path from "path";
import { initOptionsSchema } from "@/commands/init.schema";
import * as ERRORS from "@/helpers/errors";
import { getProjectInfo } from "@/helpers/get-project-info";
import { logger, highlight, spinner } from "@/utils";
import fs from "fs-extra";
import { z } from "zod";

export async function preFlightInit(
  options: z.infer<typeof initOptionsSchema>
) {
  let errors: Record<string, boolean> = {};

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  if (
    !fs.existsSync(options.cwd) ||
    !fs.existsSync(path.resolve(options.cwd, "package.json"))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true;
    return {
      errors,
      projectInfo: null,
    };
  }

  const projectSpinner = spinner(`Preflight checks.`, {
    silent: options.silent,
  }).start();

  if (
    fs.existsSync(path.resolve(options.cwd, "dotui.config.json")) &&
    !options.force
  ) {
    projectSpinner?.fail();
    logger.break();
    logger.error(
      `A ${highlight.info(
        "dotui.config.json"
      )} file already exists at ${highlight.info(
        options.cwd
      )}.\nTo start over, remove the ${highlight.info(
        "dotui.config.json"
      )} file and run ${highlight.info("init")} again.`
    );
    logger.break();
    process.exit(1);
  }

  projectSpinner?.succeed();

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
        )}.\n` +
          `Visit ${highlight.info(
            projectInfo?.framework.links.installation
          )} to manually configure your project.\nOnce configured, you can use the cli to add components.`
      );
    }
    logger.break();
    process.exit(1);
  }
  frameworkSpinner?.succeed(
    `Verifying framework. Found ${highlight.info(
      projectInfo.framework.label
    )}.`
  );

  const tailwindSpinner = spinner(`Validating Tailwind CSS.`, {
    silent: options.silent,
  }).start();
  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    errors[ERRORS.TAILWIND_NOT_CONFIGURED] = true;
    tailwindSpinner?.fail();
  } else {
    tailwindSpinner?.succeed();
  }

  const tsConfigSpinner = spinner(`Validating import alias.`, {
    silent: options.silent,
  }).start();
  if (!projectInfo?.aliasPrefix) {
    errors[ERRORS.IMPORT_ALIAS_MISSING] = true;
    tsConfigSpinner?.fail();
  } else {
    tsConfigSpinner?.succeed();
  }

  if (Object.keys(errors).length > 0) {
    if (errors[ERRORS.TAILWIND_NOT_CONFIGURED]) {
      logger.break();
      logger.error(
        `No Tailwind CSS configuration found at ${highlight.info(
          options.cwd
        )}.`
      );
      logger.error(
        `It is likely you do not have Tailwind CSS installed or have an invalid configuration.`
      );
      logger.error(`Install Tailwind CSS then try again.`);
      if (projectInfo?.framework.links.tailwind) {
        logger.error(
          `Visit ${highlight.info(
            projectInfo?.framework.links.tailwind
          )} to get started.`
        );
      }
    }

    if (errors[ERRORS.IMPORT_ALIAS_MISSING]) {
      logger.break();
      logger.error(`No import alias found in your tsconfig.json file.`);
      if (projectInfo?.framework.links.installation) {
        logger.error(
          `Visit ${highlight.info(
            projectInfo?.framework.links.installation
          )} to learn how to set an import alias.`
        );
      }
    }

    logger.break();
    process.exit(1);
  }

  return {
    errors,
    projectInfo,
  };
}