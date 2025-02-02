import { confirm, isCancel } from "@clack/prompts";
import { RegistryItemFile } from "@dotui/registry";
import { existsSync, promises as fs } from "fs";
import path, { basename } from "path";
import { Config } from "@/helpers/get-config";
import { transform } from "@/helpers/transformers";

interface Result {
  filesCreated: string[];
  filesUpdated: string[];
  filesSkipped: string[];
}

export async function updateFiles(
  files: RegistryItemFile[],
  config: Config,
  options: { overwrite?: boolean } = {}
): Promise<Result> {
  options = {
    overwrite: false,
    ...options,
  };

  if (!files.length)
    return { filesCreated: [], filesUpdated: [], filesSkipped: [] };

  let filesCreated = [];
  let filesUpdated = [];
  let filesSkipped = [];

  for (const file of files) {
    if (!file.content) continue;

    let filePath = resolveFilePath(file, config, {
      isSrcDir: false, // TODO: fix this
    });

    const fileName = basename(file.path);
    const targetDir = path.dirname(filePath);
    const existingFile = existsSync(filePath);

    if (existingFile && !options.overwrite) {
      const overwrite = await confirm({
        message: `The file ${fileName} already exists. Would you like to overwrite?`,
        initialValue: false,
      });

      if (isCancel(overwrite)) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath));
        continue;
      }
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
      },
      []
    );

    await fs.writeFile(filePath, content, "utf-8");

    existingFile
      ? filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath))
      : filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath));
  }

  return { filesCreated, filesUpdated, filesSkipped };
}

function resolveFilePath(
  file: RegistryItemFile,
  config: Config,
  options: {
    isSrcDir?: boolean;
  }
) {
  if (file.path) {
    if (file.path.startsWith("~/")) {
      return path.join(config.resolvedPaths.cwd, file.path.replace("~/", ""));
    }

    return options.isSrcDir
      ? path.join(
          config.resolvedPaths.cwd,
          "src",
          file.path.replace("src/", "")
        )
      : path.join(config.resolvedPaths.cwd, file.path.replace("src/", ""));
  }

  const targetDir = resolveFileTargetDirectory(file, config);

  const relativePath = resolveNestedFilePath(file.path, targetDir);
  return path.join(targetDir, relativePath);
}

function resolveFileTargetDirectory(file: RegistryItemFile, config: Config) {
  if (file.type === "component") {
    return config.resolvedPaths.components;
  }
  if (file.type === "core") {
    return config.resolvedPaths.core;
  }

  if (file.type === "hook") {
    return config.resolvedPaths.hooks;
  }

  if (file.type === "lib") {
    return config.resolvedPaths.lib;
  }

  return config.resolvedPaths.components;
}

export function resolveNestedFilePath(
  filePath: string,
  targetDir: string
): string {
  // Normalize paths by removing leading/trailing slashes
  const normalizedFilePath = filePath.replace(/^\/|\/$/g, "");
  const normalizedTargetDir = targetDir.replace(/^\/|\/$/g, "");

  // Split paths into segments
  const fileSegments = normalizedFilePath.split("/");
  const targetSegments = normalizedTargetDir.split("/");

  // Find the last matching segment from targetDir in filePath
  const lastTargetSegment = targetSegments[targetSegments.length - 1];
  const commonDirIndex = fileSegments.findIndex(
    (segment) => segment === lastTargetSegment
  );

  if (commonDirIndex === -1) {
    // Return just the filename if no common directory is found
    return fileSegments[fileSegments.length - 1];
  }

  // Return everything after the common directory
  return fileSegments.slice(commonDirIndex + 1).join("/");
}
