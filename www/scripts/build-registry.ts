import { existsSync, promises as fs } from "node:fs";
import path from "path";
import { registry } from "@/registry";
import { base } from "@/registry/registry-base";
import { styles } from "@/registry/registry-styles";
import type { RegistryItemProps } from "@/registry/types";
import { hasStyles } from "@/registry/types";
import { execa } from "execa";
import { rimraf } from "rimraf";

const REGISTRY_PATH = path.join(process.cwd(), "public/r");
const REGISTRY_URL =
  // eslint-disable-next-line no-restricted-properties
  process.env.NODE_ENV === "production"
    ? "https://dotui.org/r"
    : "http://localhost:3000/r";

const SHADCN_REGISTRY_PATH = path.join(process.cwd(), "src/registry");
const INTERNAL_REGISTRY_PATH = path.join(process.cwd(), "src/modules/registry");

const setup = async () => {
  // clean up src/registry
  rimraf.sync(SHADCN_REGISTRY_PATH);
  if (!existsSync(SHADCN_REGISTRY_PATH)) {
    await fs.mkdir(SHADCN_REGISTRY_PATH, { recursive: true });
  }

  // clean up public/r
  rimraf.sync(REGISTRY_PATH);
  if (!existsSync(REGISTRY_PATH)) {
    await fs.mkdir(REGISTRY_PATH, { recursive: true });
  }
};

const buildRegistry = async () => {
  await Promise.all(
    styles.map(async (t) => {
       
      const indexPayload: any = {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        extends: "none",
        name: t.name,
        homepage: `${REGISTRY_URL}/themes/${t.name}`,
        items: [],
      };

      indexPayload.items.push(transformRegistryItem(base, t.name));

      // create public/r/{styleName} folder
      const publicStylePath = path.join(REGISTRY_PATH, t.name);
      await fs.mkdir(publicStylePath, { recursive: true });

      // create registry/{styleName} folder
      const stylePath = path.join(SHADCN_REGISTRY_PATH, t.name);
      await fs.mkdir(stylePath, { recursive: true });

      // create registry/{styleName} folder
      const uiPath = path.join(stylePath, "ui");
      await fs.mkdir(uiPath, { recursive: true });

      // create registry/{styleName}/hooks folder
      const hooksPath = path.join(stylePath, "hooks");
      await fs.mkdir(hooksPath, { recursive: true });

      // create registry/{styleName}/lib folder
      const libPath = path.join(stylePath, "lib");
      await fs.mkdir(libPath, { recursive: true });

      for (const item of registry) {
        if (hasStyles(item)) {
          const style = item.styles[0]!;
          for (const file of style.files) {
            const rawFileContent = await fs.readFile(
              path.join(INTERNAL_REGISTRY_PATH, file.path),
              "utf-8",
            );
            const fileContent = transformContent(rawFileContent, t.name, [
              importTransformer,
            ]);
            await fs.writeFile(
              path.join(stylePath, file?.target ?? ""),
              fileContent,
            );
            indexPayload.items.push(
              transformRegistryItem({ ...style, name: item.name }, t.name),
            );
          }
        } else {
          for (const file of item.files) {
            const rawFileContent = await fs.readFile(
              path.join(INTERNAL_REGISTRY_PATH, file.path),
              "utf-8",
            );
            const fileContent = transformContent(rawFileContent, t.name, [
              importTransformer,
            ]);
            await fs.writeFile(
              path.join(stylePath, file?.target ?? ""),
              fileContent,
            );
            indexPayload.items.push(transformRegistryItem(item, t.name));
          }
        }

        // create public/r/{styleName}/index.json
        await fs.writeFile(
          path.join(REGISTRY_PATH, `${t.name}/index.json`),
          JSON.stringify(indexPayload, null, 2),
        );
      }

      // run shadcn script
      await execa(
        "pnpm",
        [
          "dlx",
          "shadcn@latest",
          "build",
          "-o",
          `./public/r/${t.name}`,
          `./public/r/${t.name}/index.json`,
        ],
        {
          stdio: "ignore",
        },
      );
    }),
  );
};

type Transformer = (content: string, styleName: string) => string;

function transformContent(
  content: string,
  styleName: string,
  transformers: Transformer[],
): string {
  return transformers.reduce(
    (acc, transformer) => transformer(acc, styleName),
    content,
  );
}

export const importTransformer: Transformer = (content, styleName) => {
  return content.replace(/from\s+["']@\/reg\/([^"']+)["']/g, (_, path) => {
    const parts = path.split("/");
    const fileName = parts.pop()!;

    const [componentName, componentStyleName] = fileName.split(".");

    const newPath = componentStyleName
      ? `@/registry/${styleName}/${parts.join("/")}/${componentName}`
      : `@/registry/${styleName}/${[...parts, fileName].join("/")}`;

    return `from "${newPath}"`;
  });
};

function transformRegistryItem(item: RegistryItemProps, styleName: string) {
  // transform registryDependencies
  const registryDependencies = item.registryDependencies?.map((dependency) => {
    return `${REGISTRY_URL}/${styleName}/${dependency}.json`;
  });

  // transform files
  const files = item.files.map((file) => {
    const filePath = file.path;
    const parts = filePath.split("/");
    const fileName = parts.pop()!;
    const [componentName, , fileExtension] = fileName.split(".");
    const newFileName = fileExtension
      ? `${componentName}.${fileExtension}`
      : fileName;
    const newFilePath = ["src/registry", styleName, ...parts, newFileName].join(
      "/",
    );
    return {
      ...file,
      target: undefined,
      path: newFilePath,
    };
  });

  return {
    ...item,
    files,
    registryDependencies,
  };
}

const run = async () => {
  try {
    await setup();
    await buildRegistry();
    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
