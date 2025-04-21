import { exec } from "child_process"
import { existsSync, promises as fs } from "node:fs";
import path from "path";
import { rimraf } from "rimraf";
import { themes } from "@/registry/registry-themes";

// Add pnpm to PATH
process.env.PATH = `${process.env.PATH}:/usr/local/bin`;

const REGISTRY_PATH = path.join(process.cwd(), "public/r");
const REGISTRY_URL =
  process.env.NODE_ENV === "production"
    ? "https://dotui.org/r"
    : "http://localhost:3000/r";

const setup = async () => {
  const targetPath = REGISTRY_PATH;
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }
};

const buildRegistry = async () => {
  await setup();

  console.log("Building registry...");

  // Build base
  const basePath = path.join(REGISTRY_PATH, "base.json");
  const basePayload = {
    name: "base",
    type: "registry:style",
    dependecies: [
      "tailwind-variants",
      "react-aria-components",
      "tailwindcss-react-aria-components",
    ],
    registryDependencies: [`${REGISTRY_URL}/utils`],
    files: [],
  };

  await fs.writeFile(basePath, JSON.stringify(basePayload, null, 2), "utf8");

  // Build utils
  const utilsPath = path.join(REGISTRY_PATH, "utils.json");
  const utilsPayload = {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
  };

  await fs.writeFile(utilsPath, JSON.stringify(utilsPayload, null, 2), "utf8");

  await Promise.all(
    themes.map(async (theme) => {
      const targetPath = path.join(REGISTRY_PATH, theme.name);
      await fs.mkdir(targetPath, { recursive: true });

      const indexPayload = {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        extends: "none",
        name: theme.name,
        homepage: `${REGISTRY_URL}/themes/${theme.name}`,
        items: [
          {
            name: "focus-styles",
            type: "registry:lib",
            files: [
              {
                path: "src/registry/lib/focus-styles.ts",
                target: "lib/utils.tsx",
                type: "registry:lib",
              },
            ],
          },
        ],
      };

      await fs.writeFile(
        path.join(targetPath, "index.json"),
        JSON.stringify(indexPayload, null, 2),
        "utf8"
      );

      await new Promise((resolve, reject) => {
        const process = exec(
          `pnpm dlx shadcn@latest build -o ./public/r/${theme.name} ./public/r/${theme.name}/index.json`
        )
    
        process.on("exit", (code) => {
          if (code === 0) {
            resolve(undefined)
          } else {
            reject(new Error(`Process exited with code ${code}`))
          }
        })
      })

    })
  );

  console.log(`✅ Successfully built ${themes.length} styles.`);
};

const run = async () => {
  try {
    await buildRegistry();
    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
