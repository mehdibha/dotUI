import path from "path";
import { initOptionsSchema } from "@/commands/init.schema";
import { getPackageManager } from "@/helpers/get-package-manager";
import { highlight, logger, spinner } from "@/utils";
import { execa } from "execa";
import fs from "fs-extra";
import prompts from "prompts";
import { z } from "zod";

const frameworks = [
  { name: "nextjs", label: "Next.js" },
  // { name: "vite", label: "Vite" },
];

export async function createProject(
  options: Pick<z.infer<typeof initOptionsSchema>, "cwd" | "force" | "srcDir">
) {
  options = {
    srcDir: false,
    ...options,
  };

  if (!options.force) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `No package.json file found. Would you like to start a new project?`,
      initial: true,
    });

    if (!proceed) {
      return {
        projectPath: null,
        projectName: null,
      };
    }
  }

  const { framework, name } = await prompts([
    {
      name: "framework",
      type: "select",
      message: `Which ${highlight.info("framework")} would you like to use?`,
      choices: frameworks.map((framework) => ({
        title: framework.label,
        value: framework.name,
      })),
    },
    {
      type: "text",
      name: "name",
      message: `What is your project named?`,
      initial: "my-app",
      format: (value: string) => value.trim(),
      validate: (value: string) =>
        value.length > 128 ? `Name should be less than 128 characters.` : true,
    },
  ]);

  const packageManager = await getPackageManager(options.cwd);

  const projectPath = `${options.cwd}/${name}`;

  // Check if path is writable.
  try {
    await fs.access(options.cwd, fs.constants.W_OK);
  } catch (error) {
    logger.break();
    logger.error(`The path ${highlight.info(options.cwd)} is not writable.`);
    logger.error(
      `It is likely you do not have write permissions for this folder or the path ${highlight.info(
        options.cwd
      )} does not exist.`
    );
    logger.break();
    process.exit(1);
  }

  if (fs.existsSync(path.resolve(options.cwd, name, "package.json"))) {
    logger.break();
    logger.error(
      `A project with the name ${highlight.info(name)} already exists.`
    );
    logger.error(`Please choose a different name and try again.`);
    logger.break();
    process.exit(1);
  }

  const createSpinner = spinner(
    `Creating a new ${
      frameworks.find((el) => el.name === framework)?.label
    } project. This may take a few minutes.`
  ).start();

  try {
    if (framework === "nextjs") {
      await createNextProject(options.cwd, {
        name,
        ts: true,
        srcDir: options.srcDir ?? true,
        packageManager,
      });
      createSpinner?.succeed("Creating a new Next.js project.");
    }
    if (framework === "vite") {
      await createViteProject(options.cwd, {
        name,
        ts: true,
        srcDir: options.srcDir ?? true,
        packageManager,
      });
      createSpinner?.succeed("Creating a new vite project.");
    }
  } catch (error) {
    logger.break();
    logger.error(error);
    logger.error(
      `Something went wrong creating a new project. Please try again.`
    );
    process.exit(1);
  }

  return {
    projectPath,
    projectName: name,
  };
}

const createNextProject = async (
  cwd: string,
  options: {
    name: string;
    ts: boolean;
    srcDir: boolean;
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
  }
) => {
  const args = [
    "--tailwind",
    "--eslint",
    "--typescript",
    "--app",
    options.srcDir ? "--src-dir" : "--no-src-dir",
    "--no-import-alias",
    `--use-${options.packageManager}`,
  ];
  await execa("npx", ["create-next-app@latest", options.name, ...args], {
    cwd,
  });
};

const createViteProject = async (
  cwd: string,
  options: {
    name: string;
    ts: boolean;
    srcDir: boolean;
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
  }
) => {
  const args = [
    options.name,
    options.packageManager === "npm" ? "--" : undefined,
    "--template",
    options.ts ? "react-ts" : "react",
  ].filter(Boolean) as string[];

  await execa(options.packageManager, ["create", "vite@latest", ...args], {
    cwd,
  });
  await execa(
    options.packageManager,
    ["install", "-D", "tailwindcss", "postcss", "autoprefixer"],
    {
      cwd: `${cwd}/${options.name}`,
    }
  );
  await execa("npx", ["tailwindcss", "init", "-p"], {
    cwd: `${cwd}/${options.name}`,
  });
  // update tailwind.config.js
  const tailwindFile = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
  await fs.writeFile(
    `${cwd}/${options.name}/tailwind.config.js`,
    tailwindFile,
    "utf-8"
  );
  // TODO: uncomplete function here
};
