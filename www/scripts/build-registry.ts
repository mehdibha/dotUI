import {
  RegistryIndex,
  registryIndexSchema,
  registryItemSchema,
} from "@dotui/schemas";
import { existsSync, promises as fs } from "node:fs";
import path from "path";
import { rimraf } from "rimraf";
import { kebabCaseToCamelCase, kebabCaseToTitleCase } from "@/lib/string";
import { base } from "@/registry/registry-base";
import { core } from "@/registry/registry-core";
import { hooks } from "@/registry/registry-hooks";
import { iconLibraries } from "@/registry/registry-icons";
import { lib } from "@/registry/registry-lib";
import { registry } from "@/registry";

const REGISTRY_PATH = path.join(process.cwd(), "public/registry");

// ----------------------------------------------------------------------------
// Build registry/index.json.
// Contains the list of all components, hooks, etc.
// ----------------------------------------------------------------------------
const buildRegistry = async () => {
  const targetPath = REGISTRY_PATH;
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const payload: RegistryIndex = registry.map((item) => ({
    name: item.name,
    type: item.type,
    deps: item.deps,
    registryDeps: item.registryDeps,
    variants: item.variants,
  }));

  registryIndexSchema.parse(payload);

  const registryJson = JSON.stringify(payload, null, 2);
  await fs.writeFile(path.join(targetPath, "index.json"), registryJson, "utf8");
};

// ----------------------------------------------------------------------------
// Build registry/base.json.
// Contains the foundations and required dependencies.
// ----------------------------------------------------------------------------
const buildBase = async () => {
  const targetPath = path.join(REGISTRY_PATH, "base.json");
  rimraf.sync(targetPath);

  const payload = { ...base };

  registryItemSchema.parse(payload);

  const baseJson = JSON.stringify(payload, null, 2);
  await fs.writeFile(targetPath, baseJson, "utf8");
};

// ----------------------------------------------------------------------------
// Build registry/core/index.json.
// Contains the list of all core components.
//
// Build registry/core/[name].json
// Component's infos.
// ----------------------------------------------------------------------------
const buildCore = async () => {
  const targetPath = path.join(REGISTRY_PATH, "core");
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const allCore = core
    .filter((elem) => {
      if (elem.variants) return true;
      if (elem.name.includes("_")) return false;
      return true;
    })
    .map((item) => ({
      name: item.name,
      type: item.type,
      label: kebabCaseToTitleCase(item.name),
      description: item.description,
    }));

  // Build registry/core/index.json
  registryIndexSchema.parse(allCore);
  const indexContent = JSON.stringify(allCore, null, 2);
  await fs.writeFile(path.join(targetPath, "index.json"), indexContent, "utf8");

  // Build registry/core/[name].json
  for (const item of core) {
    let files;
    if (item.files) {
      files = await Promise.all(
        item.files.map(async (file) => {
          const content = await fs.readFile(
            path.join(process.cwd(), "src", "registry", file.source),
            "utf8"
          );
          return {
            type: file.type,
            content: content,
            path: file.target,
          };
        })
      );
    }

    const payload = {
      ...item,
      files,
    };

    registryItemSchema.parse(payload);

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload, null, 2),
      "utf8"
    );
  }
};

const buildHooks = async () => {
  const targetPath = path.join(REGISTRY_PATH, "hooks");
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const allHooks = hooks
    .filter((elem) => {
      if (elem.variants) return true;
      if (elem.name.includes("_")) return false;
      return true;
    })
    .map((item) => ({
      name: item.name,
      type: item.type,
      label: kebabCaseToCamelCase(item.name),
      description: item.description,
    }));

  // Build registry/core/index.json
  const indexContent = JSON.stringify(allHooks, null, 2);
  await fs.writeFile(path.join(targetPath, "index.json"), indexContent, "utf8");

  // Build registry/core/[name].json
  for (const item of hooks) {
    let files;
    if (item.files) {
      files = await Promise.all(
        item.files.map(async (file) => {
          const content = await fs.readFile(
            path.join(process.cwd(), "src", "registry", file.source),
            "utf8"
          );
          return {
            type: file.type,
            content: content,
            path: file.target,
          };
        })
      );
    }

    const payload = {
      ...item,
      files,
    };

    registryItemSchema.parse(payload);

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload, null, 2),
      "utf8"
    );
  }
};

const buildLib = async () => {
  const targetPath = path.join(REGISTRY_PATH, "lib");
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const allLib = lib
    .filter((elem) => {
      if (elem.variants) return true;
      if (elem.name.includes("_")) return false;
      return true;
    })
    .map((item) => ({
      name: item.name,
      type: item.type,
      label: kebabCaseToCamelCase(item.name),
      description: item.description,
    }));

  // Build registry/core/index.json
  const indexContent = JSON.stringify(allLib, null, 2);
  await fs.writeFile(path.join(targetPath, "index.json"), indexContent, "utf8");

  // Build registry/core/[name].json
  for (const item of lib) {
    let files;
    if (item.files) {
      files = await Promise.all(
        item.files.map(async (file) => {
          const content = await fs.readFile(
            path.join(process.cwd(), "src", "registry", file.source),
            "utf8"
          );
          return {
            type: file.type,
            content: content,
            path: file.target,
          };
        })
      );
    }

    const payload = {
      ...item,
      files,
    };

    registryItemSchema.parse(payload);

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload, null, 2),
      "utf8"
    );
  }
};

// ----------------------------------------------------------------------------
// Build registry/icons/index.json.
// Contains the list of all icon libraries.
//
// Build registry/icons/[iconLibrary].json
// Contains the list of all icons in the specified icon library.
//
// Build __icons__/index.tsx
// Contains all the icons as react components.
// ----------------------------------------------------------------------------
const buildIcons = async () => {
  const targetPath = path.join(REGISTRY_PATH, "icons");
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const payload = Object.entries(iconLibraries).map(([, value]) => ({
    name: value.name,
    type: "icon-library",
    dependencies: [value.package],
  }));

  registryIndexSchema.parse(payload);

  // Build registry/icons/index.json
  const iconLibrariesJson = JSON.stringify(payload, null, 2);
  await fs.writeFile(
    path.join(targetPath, "index.json"),
    iconLibrariesJson,
    "utf8"
  );

  // Build registry/icons/[iconLibrary].json
  //   for (const iconLibrary of iconLibraries) {
  //     const libIcons = Object.entries(icons).reduce<Record<string, string>>(
  //       (acc, [key, value]) => {
  //         acc[key] = value[iconLibrary.name as keyof typeof value];
  //         return acc;
  //       },
  //       {}
  //     );

  //     const payload = {
  //       name: iconLibrary.name,
  //       dependency: iconLibrary.dependency,
  //       icons: libIcons,
  //     };

  //     const iconLibraryJson = JSON.stringify(payload, null, 2);
  //     await fs.writeFile(
  //       path.join(targetPath, `${iconLibrary.name}.json`),
  //       iconLibraryJson,
  //       "utf8"
  //     );
  //   }

  //   // Build __icons__/index.tsx
  //   const iconsIndexPath = path.join(process.cwd(), "src", "__icons__");
  //   rimraf.sync(iconsIndexPath);
  //   if (!existsSync(iconsIndexPath)) {
  //     await fs.mkdir(iconsIndexPath, { recursive: true });
  //   }

  //   let iconsIndexContent = `// This file is autogenerated by scripts/build-registry.ts
  // // Do not edit this file directly.
  // "use client";

  // ${iconLibraries
  //   .map((lib) => `import * as ${lib.name} from "${lib.import}";`)
  //   .join("\n")}
  // import { createIcon } from "./create-icon";

  // `;

  //   for (const [iconName, iconVariants] of Object.entries(icons)) {
  //     iconsIndexContent += `export const ${iconName} = createIcon({
  //   ${iconLibraries
  //     .map(
  //       (lib) =>
  //         `${lib.name}: ${lib.name}.${
  //           iconVariants[lib.name as keyof typeof iconVariants]
  //         }`
  //     )
  //     .join(",\n  ")}
  // });\n\n`;
  //   }

  //   await fs.writeFile(
  //     path.join(iconsIndexPath, "index.tsx"),
  //     iconsIndexContent,
  //     "utf8"
  //   );
};

const run = async () => {
  try {
    await buildRegistry();
    await buildBase();
    await buildCore();
    await buildHooks();
    await buildLib();
    await buildIcons();

    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
