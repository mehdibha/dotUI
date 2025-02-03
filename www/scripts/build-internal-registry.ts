import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

// import { iconLibraries, icons } from "@/registry/registry-icons";

// import { RegistryItem } from "@/registry/types";

const INTERNAL_REGISTRY_PATH = path.join(process.cwd(), "src/__registry__");
// const SOURCE_REGISTRY_PATH = path.join(process.cwd(), "src/registry");

// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
async function setup() {
  const targetPath = INTERNAL_REGISTRY_PATH;
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }
  const autogeneratedFilePath = path.join(targetPath, ".autogenerated");
  await fs.writeFile(
    autogeneratedFilePath,
    "This directory is autogenerated. Do not edit its contents directly.",
    "utf8"
  );
}

// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
async function buildDemos() {
  const targetPath = INTERNAL_REGISTRY_PATH;

  let index = `// This file is autogenerated by scripts/build-internal-registry.ts
  // Do not edit this file directly.
  import * as React from "react"
  
  export const Index: Record<
    string,
    {
      files: string[];
      component: React.LazyExoticComponent<React.ComponentType<object>>;
    }
  > = {
  `;

  const sourcePath = path.join(process.cwd(), "src/components/demos");
  const folders = await fs.readdir(sourcePath);
  for (const folder of folders) {
    const folderPath = path.join(sourcePath, folder);
    // replace tsx with empty string
    const primitiveName = folder.replace(".tsx", "");
    const demos = await fs.readdir(folderPath);
    for (const demo of demos) {
      const demoName = `${primitiveName}/${demo.replace(".tsx", "")}`;
      const demoPath = `@/components/demos/${primitiveName}/${demo.replace(".tsx", "")}`;
      index += `
      "${demoName}": {
        files: ["components/demos/${primitiveName}/${demo}"],
        component: React.lazy(() => import("${demoPath}")),
      },`;
    }
  }

  index += `
}
`;
  rimraf.sync(path.join(targetPath, "demos.tsx"));
  await fs.writeFile(path.join(targetPath, "demos.tsx"), index, "utf8");
}

// // ----------------------------------------------------------------------------
// //
// // ----------------------------------------------------------------------------
// type IconLibrary = keyof typeof iconLibraries;

// async function buildIcons() {
//   const targetPath = path.join(INTERNAL_REGISTRY_PATH, "icons");
//   let index = `// @ts-nocheck
//   // This file is autogenerated by scripts/build-internal-registry.ts
//   // Do not edit this file directly.
//   import * as React from "react"

//   export const Icons = {
//   `;

//   for (const [icon, libraries] of Object.entries(icons)) {
//     index += `  "${icon}": {`;
//     for (const [library, componentName] of Object.entries(libraries)) {
//       const packageName = iconLibraries[library as IconLibrary].package;
//       if (packageName) {
//         index += `
//   ${library}: React.lazy(() => import("${packageName}").then(mod => ({
//     default: mod.${componentName}
//   }))),`;
//       }
//     }
//     index += `
// },`;
//   }
//   index += `
// }
// `;

//   rimraf.sync(targetPath);
//   if (!existsSync(targetPath)) {
//     await fs.mkdir(targetPath, { recursive: true });
//   }

//   await fs.writeFile(path.join(targetPath, "registry.ts"), index, "utf8");

//   // Build __icons__/index.tsx
//   let iconsIndexContent = `"use client";

// // This file is autogenerated by scripts/build-registry.ts
// // Do not edit this file directly.

// import { createIcon } from "@/lib/create-icon";

// `;

//   for (const [iconName] of Object.entries(icons)) {
//     iconsIndexContent += `export const ${iconName} = createIcon("${iconName}");\n`;
//   }

//   await fs.writeFile(
//     path.join(targetPath, "index.tsx"),
//     iconsIndexContent,
//     "utf8"
//   );
// }

// // ----------------------------------------------------------------------------
// //
// // ----------------------------------------------------------------------------
// async function buildCoreComponents() {
//   const sourcePath = path.join(SOURCE_REGISTRY_PATH, "core");
//   const targetPath = path.join(INTERNAL_REGISTRY_PATH, "core");
//   rimraf.sync(targetPath);
//   if (!existsSync(targetPath)) {
//     await fs.mkdir(targetPath, { recursive: true });
//   }

//   // build __registry__/core
//   const files = await fs.readdir(sourcePath);
//   for (const file of files) {
//     const sourceFilePath = path.join(sourcePath, file);
//     const targetFilePath = path.join(targetPath, file);

//     let content = await fs.readFile(sourceFilePath, "utf-8");

//     // transform icons import
//     // content = content.replace(/lucide-react/g, "@/__registry__/icons");
//     // transform registryDependencies import
//     const overrides = [["loader-ring", "loader"]];
//     for (const [from, to] of overrides) {
//       content = content.replace(
//         new RegExp(`@/registry/core/${from}`, "g"),
//         `@/components/dynamic-core/${to}`
//       );
//     }
//     await fs.writeFile(targetFilePath, content);
//   }

//   // // build __registry__/dynamic-core/index.ts
//   // let index = `// This file is autogenerated by scripts/build-internal-registry.ts
//   // // Do not edit this file directly.
//   // import * as React from "react"

//   // export const Components = {`;
// }

async function run() {
  try {
    await setup();
    await buildDemos();
    // await buildCoreComponents();
    // await buildIcons();
    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
