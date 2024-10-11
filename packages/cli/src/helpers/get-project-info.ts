import path from "path";
import { FRAMEWORKS, Framework } from "@/constants/frameworks";
import fg from "fast-glob";
import fs from "fs-extra";
import { loadConfig } from "tsconfig-paths";

type ProjectInfo = {
  framework: Framework;
  isSrcDir: boolean;
  isRSC: boolean;
  isTsx: boolean;
  tailwindConfigFile: string | null;
  tailwindCssFile: string | null;
  aliasPrefix: string | null;
};

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
];

export async function getProjectInfo(cwd: string): Promise<ProjectInfo | null> {
  const [
    configFiles,
    isSrcDir,
    isTsx,
    tailwindConfigFile,
    tailwindCssFile,
    aliasPrefix,
  ] = await Promise.all([
    fg.glob("**/{next,vite,astro}.config.*|gatsby-config.*|composer.json", {
      cwd,
      deep: 3,
      ignore: PROJECT_SHARED_IGNORE,
    }),
    fs.pathExists(path.resolve(cwd, "src")),
    isTypeScriptProject(cwd),
    getTailwindConfigFile(cwd),
    getTailwindCssFile(cwd),
    getTsConfigAliasPrefix(cwd),
  ]);

  const isUsingAppDir = await fs.pathExists(
    path.resolve(cwd, `${isSrcDir ? "src/" : ""}app`)
  );

  const type: ProjectInfo = {
    framework: FRAMEWORKS["manual"],
    isSrcDir,
    isRSC: false,
    isTsx,
    tailwindConfigFile,
    tailwindCssFile,
    aliasPrefix,
  };

  if (!configFiles.length) {
    return type;
  }

  // Next.js.
  if (configFiles.find((file) => file.startsWith("next.config."))?.length) {
    type.framework = isUsingAppDir
      ? FRAMEWORKS["next-app"]
      : FRAMEWORKS["next-pages"];
    type.isRSC = isUsingAppDir;
    return type;
  }

  // Astro.
  if (configFiles.find((file) => file.startsWith("astro.config."))?.length) {
    type.framework = FRAMEWORKS["astro"];
    return type;
  }

  // Gatsby.
  if (configFiles.find((file) => file.startsWith("gatsby-config."))?.length) {
    type.framework = FRAMEWORKS["gatsby"];
    return type;
  }

  // Laravel.
  if (configFiles.find((file) => file.startsWith("composer.json"))?.length) {
    type.framework = FRAMEWORKS["laravel"];
    return type;
  }

  // Vite and Remix.
  // They both have a vite.config.* file.
  if (configFiles.find((file) => file.startsWith("vite.config."))?.length) {
    // We'll assume that if the project has an app dir, it's a Remix project.
    // Otherwise, it's a Vite project.
    // TODO: Maybe check for `@remix-run/react` in package.json?
    type.framework = isUsingAppDir ? FRAMEWORKS["remix"] : FRAMEWORKS["vite"];
    return type;
  }

  return type;
}

export async function getTailwindCssFile(cwd: string) {
  const files = await fg.glob("**/*.css", {
    cwd,
    deep: 5,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!files.length) {
    return null;
  }

  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), "utf8");
    // Assume that if the file contains `@tailwind base` it's the main css file.
    if (contents.includes("@tailwind base")) {
      return file;
    }
  }

  return null;
}

export async function getTailwindConfigFile(cwd: string) {
  const files = await fg.glob("tailwind.config.*", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!files.length) {
    return null;
  }

  return files[0];
}

export async function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = await loadConfig(cwd);

  if (tsConfig?.resultType === "failed" || !tsConfig?.paths) {
    return null;
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (
      paths.includes("./*") ||
      paths.includes("./src/*") ||
      paths.includes("./app/*") ||
      paths.includes("./resources/js/*") // Laravel.
    ) {
      return alias.at(0) ?? null;
    }
  }

  return null;
}

export async function isTypeScriptProject(cwd: string) {
  const files = await fg.glob("tsconfig.*", {
    cwd,
    deep: 1,
    ignore: PROJECT_SHARED_IGNORE,
  });

  return files.length > 0;
}

export async function getTsConfig() {
  try {
    const tsconfigPath = path.join("tsconfig.json");
    const tsconfig = await fs.readJSON(tsconfigPath);

    if (!tsconfig) {
      throw new Error("tsconfig.json is missing");
    }

    return tsconfig;
  } catch (error) {
    return null;
  }
}
