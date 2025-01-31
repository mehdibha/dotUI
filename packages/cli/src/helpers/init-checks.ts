import { spinner, confirm, isCancel, outro } from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import { c } from "@/utils";
import {
  getProjectFramework,
  getReactVersion,
  getTailwindCssFile,
  getTailwindVersion,
  getTsConfigAliasPrefix,
  isTypescriptProject,
} from "./get-project-info";

interface Options {
  dir: string;
}

export async function initChecks(options: Options) {
  const checkSpinner = spinner();
  checkSpinner.start("Verifying project config");

  const exit = (message: string, error: boolean = true) => {
    checkSpinner.stop("Verifying project config");
    if (error) {
      outro(c.error(message));
      process.exit(1);
    }
    outro(message);
    process.exit(1);
  };

  if (
    !fs.existsSync(options.dir) ||
    !fs.existsSync(path.resolve(options.dir, "package.json"))
  ) {
    exit(`❌ ${options.dir} does not contain a package.json file.`);
  }

  checkSpinner.message("Verifying framework");
  const framework = getProjectFramework(options.dir);
  if (!framework) {
    exit(
      `❌ Could not determine the framework of your project. Please make sure it is a React project.`
    );
  }

  checkSpinner.message("Verifying React version.");
  const reactVersion = await getReactVersion(options.dir);
  if (!reactVersion) {
    exit(
      `❌ Could not determine the version of React. Please make sure it is installed in ${options.dir}.`
    );
  }
  if (reactVersion === "older") {
    exit(
      `❌ You are using an older version of React. Please upgrade to React 19.`
    );
  }

  checkSpinner.message("Verifying Tailwind config.");
  const tailwindVersion = await getTailwindVersion(options.dir);
  if (!tailwindVersion) {
    exit(
      `${c.error(`❌ Could not determine the version of Tailwind CSS. Please make sure it is installed in ${options.dir}.`)} See ${c.info("https://tailwindcss.com/docs/installation")}`,
      false
    );
  }
  if (tailwindVersion === "v3") {
    exit(
      `${c.error("❌ You are using Tailwind CSS v3. Please upgrade to v4.")} See ${c.info("https://tailwindcss.com/docs/installation")}`,
      false
    );
  }
  const tailwindCssFile = await getTailwindCssFile(options.dir);
  if (!tailwindCssFile) {
    exit(
      `❌ It is likely you didn't configure Tailwind CSS correctly. Please make sure you have a css file that imports Tailwind CSS in your project.`
    );
  }

  checkSpinner.message("Verifying typescript config");
  const isTypescript = await isTypescriptProject(options.dir);
  if (!isTypescript) {
    exit(
      `❌ ${options.dir} is not a TypeScript project. Please make sure it has a tsconfig.json file.`
    );
  }

  checkSpinner.message("Verifying import alias");
  const aliasPrefix = getTsConfigAliasPrefix(options.dir);
  if (!aliasPrefix) {
    exit(
      `❌ Could not determine the alias prefix in your tsconfig.json file. Please make sure it is set correctly.`
    );
  }

  checkSpinner.message("Verifying configuration file");
  if (fs.existsSync(path.resolve(options.dir, "dotui.json"))) {
    checkSpinner.stop("Verifying project config.");

    const override = await confirm({
      message: `${c.warn("A dotui.json file already exists. Do you want to override it?")}`,
    });

    if (isCancel(override)) {
      exit("Project init cancelled.");
    }
  } else {
    checkSpinner.stop("Verifying project config.");
  }
}
