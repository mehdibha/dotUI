import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";
import { loadConfig as loadTsConfig } from "tsconfig-paths";
import { getPackageJson } from "./get-package-info";

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
];

export async function getTailwindVersion(
  cwd: string
): Promise<"v3" | "v4" | null> {
  const packageInfo = getPackageJson(cwd);

  const twVersion = packageInfo?.dependencies?.tailwindcss;
  const twDevVersion = packageInfo?.devDependencies?.tailwindcss;

  if (!twVersion && !twDevVersion) {
    return null;
  }

  if (/^(?:\^|~)?3(?:\.\d+)*(?:-.*)?$/.test(twVersion || twDevVersion || "")) {
    return "v3";
  }

  if (/^(?:\^|~)?4(?:\.\d+)*(?:-.*)?$/.test(twVersion || twDevVersion || "")) {
    return "v4";
  }

  return null;
}

export async function isTypescriptProject(cwd: string) {
  const files = await fg.glob("tsconfig.*", {
    cwd,
    deep: 1,
    ignore: PROJECT_SHARED_IGNORE,
  });

  return files.length > 0;
}

export async function getReactVersion(
  cwd: string
): Promise<"v19" | "older" | null> {
  const packageInfo = getPackageJson(cwd);

  const reactVersion = packageInfo?.dependencies?.react;

  if (!reactVersion) {
    return null;
  }

  if (/^(?:\^|~)?19(?:\.\d+)*(?:-.*)?$/.test(reactVersion || "")) {
    return "v19";
  }

  return "older";
}

export async function getTailwindCssFile(cwd: string) {
  const files = await fg.glob(["**/*.css", "**/*.scss"], {
    cwd,
    deep: 5,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!files.length) {
    return null;
  }

  for (const file of files) {
    const content = await fs.readFile(path.resolve(cwd, file), "utf8");
    if (
      content.includes(`@import "tailwindcss"`) ||
      content.includes(`@import 'tailwindcss'`)
    ) {
      return file;
    }
  }

  return null;
}

export function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = loadTsConfig(cwd);

  if (
    tsConfig?.resultType === "failed" ||
    !Object.entries(tsConfig?.paths).length
  ) {
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
      return alias.replace(/\/\*$/, "") ?? null;
    }
  }

  // Use the first alias as the prefix.
  return Object.keys(tsConfig?.paths)?.[0].replace(/\/\*$/, "") ?? null;
}

export async function getProjectFramework(cwd: string) {
  const configFiles = await fg.glob(
    "**/{next,vite,astro}.config.*|gatsby-config.*|composer.json",
    {
      cwd,
      deep: 3,
      ignore: PROJECT_SHARED_IGNORE,
    }
  );

  if (configFiles.find((file) => file.startsWith("next.config."))?.length) {
    return "next.js";
  }

  if (configFiles.find((file) => file.startsWith("astro.config."))?.length) {
    return "astro";
  }

  if (configFiles.find((file) => file.startsWith("gatsby-config."))?.length) {
    return "gatsby";
  }

  if (configFiles.find((file) => file.startsWith("composer.json"))?.length) {
    return "laravel";
  }

  const packageJson = getPackageJson(cwd, false);

  if (
    Object.keys(packageJson?.dependencies ?? {}).find((dep) =>
      dep.startsWith("@remix-run/")
    )
  ) {
    return "remix";
  }

  if (configFiles.find((file) => file.startsWith("vite.config."))?.length) {
    return "vite";
  }

  return null;
}
