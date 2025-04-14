import { execa } from "execa";
import { existsSync, promises as fs } from "node:fs";
import path from "path";
import { rimraf } from "rimraf";
import { themes } from "@/registry/registry-themes";

const REGISTRY_PATH = path.join(process.cwd(), "public/r");

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

  await Promise.all(
    themes.map(async (theme) => {
      const targetPath = path.join(REGISTRY_PATH, theme.name);
      await fs.mkdir(targetPath, { recursive: true });

      const payload: any = {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        extends: "none",
        name: theme.name,
        homepage: `https://dotui.org/themes/${theme.name}`,
        items: [],
      };

      payload.items.push({
        name: "base",
        type: "registry:style",
        dependecies: [
          "tailwind-variants",
          "react-aria-components",
          "tailwindcss-react-aria-components",
        ],
        registryDependencies: ["utils", "focus-styles"],
        files: [],
      });

      payload.items.push({
        name: "utils",
        type: "registry:lib",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
          {
            path: "src/registry/lib/utils.tsx",
            target: "lib/utils.tsx",
            type: "registry:lib",
          },
        ],
      });

      await fs.writeFile(
        path.join(targetPath, "index.json"),
        JSON.stringify(payload, null, 2),
        "utf8"
      );

      try {
        await execa(
          "pnpm dlx",
          [
            "shadcn@latest",
            "build",
            "-o",
            `./public/r/${theme.name}`,
            `./public/r/${theme.name}/index.json`,
          ],
          {
            stdio: "ignore",
          }
        );
      } catch (error) {
        console.error(`❌ Failed to build registry for theme: ${theme.name}`);
        console.error(error);
      }
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
