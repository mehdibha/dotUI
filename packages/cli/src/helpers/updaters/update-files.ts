import { existsSync, promises as fs } from "node:fs";
import path, { basename } from "path";
import prompts from "prompts";
import { Config } from "@/helpers/get-config";
import { getProjectInfo } from "@/helpers/get-project-info";
import { logger, highlight, spinner } from "@/utils";
import { getRegistryItemFileTargetPath } from "@/helpers/registry";
import { transform } from "@/helpers/transformers";
import { transformCssVars } from "@/helpers/transformers/transform-css-vars";
import { transformImport } from "@/helpers/transformers/transform-import";
import { transformRsc } from "@/helpers/transformers/transform-rsc";
import { transformTwPrefixes } from "@/helpers/transformers/transform-tw-prefix";
import type { RegistryItem } from "@dotui/registry/types";

export async function updateFiles(
  files: RegistryItem["files"],
  config: Config,
  options: {
    overwrite?: boolean;
  }
) {
  if (!files?.length) {
    return;
  }
  options = {
    overwrite: false,
    ...options,
  };
  const filesCreatedSpinner = spinner(`Updating files.`)?.start();

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd);

  const filesCreated = [];
  const filesUpdated = [];
  const filesSkipped = [];

  for (const file of files) {
    if (!file.content) {
      continue;
    }

    let targetDir = getRegistryItemFileTargetPath(file, config);
    const fileName = basename(file.path);
    let filePath = path.join(targetDir, fileName);

    if (file.target) {
      filePath = projectInfo?.isSrcDir
        ? path.join(config.resolvedPaths.cwd, "src", file.target)
        : path.join(config.resolvedPaths.cwd, file.target);
      targetDir = path.dirname(filePath);
    }

    if (!config.tsx) {
      filePath = filePath.replace(/\.tsx?$/, (match) =>
        match === ".tsx" ? ".jsx" : ".js"
      );
    }

    const existingFile = existsSync(filePath);
    if (existingFile && !options.overwrite) {
      filesCreatedSpinner.stop();
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `The file ${highlight.info(
          fileName
        )} already exists. Would you like to overwrite?`,
        initial: false,
      });

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath));
        continue;
      }
      filesCreatedSpinner?.start();
    }

    // Create the target directory if it doesn't exist.
    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true });
    }

    // Run our transformers.
    const content = await transform(
      {
        filename: file.path,
        raw: file.content,
        config,
        transformJsx: !config.tsx,
      },
      [transformImport, transformRsc, transformCssVars, transformTwPrefixes]
    );

    await fs.writeFile(filePath, content, "utf-8");
    existingFile
      ? filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath))
      : filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath));
  }

  const hasUpdatedFiles = filesCreated.length || filesUpdated.length;
  if (!hasUpdatedFiles && !filesSkipped.length) {
    filesCreatedSpinner?.info("No files updated.");
  }

  if (filesCreated.length) {
    filesCreatedSpinner?.succeed(
      `Created ${filesCreated.length} ${
        filesCreated.length === 1 ? "file" : "files"
      }:`
    );
    for (const file of filesCreated) {
      logger.log(`  - ${file}`);
    }
  } else {
    filesCreatedSpinner?.stop();
  }

  if (filesUpdated.length) {
    spinner(
      `Updated ${filesUpdated.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }:`
    )?.info();
    for (const file of filesUpdated) {
      logger.log(`  - ${file}`);
    }
  }

  if (filesSkipped.length) {
    spinner(
      `Skipped ${filesSkipped.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }:`
    )?.info();
    for (const file of filesSkipped) {
      logger.log(`  - ${file}`);
    }
  }

  logger.break();
}
