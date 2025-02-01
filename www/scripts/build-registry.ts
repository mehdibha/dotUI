import { registryItemSchema, registrySchema } from "@dotui/registry";
import { existsSync, promises as fs } from "node:fs";
import path from "path";
import { rimraf } from "rimraf";
import {
  kebabCaseToTitleCase,
  kekabCaseToTitle,
  snakeCaseToTitle,
} from "@/lib/string";
import { core } from "@/registry/registry-core";
import { hooks } from "@/registry/registry-hooks";
import { iconLibraries, icons } from "@/registry/registry-icons";
import { lib } from "@/registry/registry-lib";
import { themes } from "@/registry/registry-themes";
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

  const payload = registry.map((item) => ({
    name: item.name,
    type: item.type,
  }));

  const registryJson = JSON.stringify(payload, null, 2);
  await fs.writeFile(path.join(targetPath, "index.json"), registryJson, "utf8");
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
    .map((comp) => ({
      name: comp.name,
      label: kebabCaseToTitleCase(comp.name),
      description: comp.description,
    }));

  // Build registry/core/index.json
  const indexContent = JSON.stringify(allCore, null, 2);
  await fs.writeFile(path.join(targetPath, "index.json"), indexContent, "utf8");

  // Build registry/core/[name].json
  for (const item of core) {
    let files;
    if (item.files) {
      files = await Promise.all(
        item.files.map(async (_file) => {
          const file =
            typeof _file === "string"
              ? {
                  path: _file,
                  type: item.type,
                  content: "",
                  target: "",
                }
              : _file;
          const content = await fs.readFile(
            path.join(process.cwd(), "src", "registry", file.path),
            "utf8"
          );
          return {
            path: file.path,
            type: file.type,
            content: content,
            target: file.target,
          };
        })
      );
    }

    const payload = registryItemSchema.safeParse({
      ...item,
      files,
    });
    
    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload.data, null, 2),
      "utf8"
    );
  }
};

// // ----------------------------------------------------------------------------
// // Build registry/icons/index.json.
// // Contains the list of all icon libraries.
// //
// // Build registry/icons/[iconLibrary].json
// // Contains the list of all icons in the specified icon library.
// //
// // Build __icons__/index.tsx
// // Contains all the icons as react components.
// // ----------------------------------------------------------------------------
// const buildIcons = async () => {
//   const targetPath = path.join(REGISTRY_PATH, "icons");
//   rimraf.sync(targetPath);
//   if (!existsSync(targetPath)) {
//     await fs.mkdir(targetPath, { recursive: true });
//   }

//   // Build registry/icons/index.json
//   const iconLibrariesJson = JSON.stringify(iconLibraries, null, 2);
//   await fs.writeFile(
//     path.join(targetPath, "index.json"),
//     iconLibrariesJson,
//     "utf8"
//   );

//   // Build registry/icons/[iconLibrary].json
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
// };

// // ----------------------------------------------------------------------------
// // Build registry/themes/index.json.
// // Contains the list of all themes.
// //
// // Build registry/themes/[name].json
// // Contains theme's variables.
// // ----------------------------------------------------------------------------
// const buildThemes = async () => {
//   const themesTargetPath = path.join(REGISTRY_PATH, "themes");
//   rimraf.sync(themesTargetPath);
//   if (!existsSync(themesTargetPath)) {
//     await fs.mkdir(themesTargetPath, { recursive: true });
//   }

//   const allThemes = themes.map((theme) => ({
//     name: theme.name,
//     label: theme.label ?? theme.name,
//   }));

//   // Build registry/themes/index.json
//   const allThemesJson = JSON.stringify(allThemes, null, 2);
//   await fs.writeFile(
//     path.join(themesTargetPath, "index.json"),
//     allThemesJson,
//     "utf8"
//   );

//   // Build registry/themes/[name].json
//   for (const theme of themes) {
//     const themeJson = JSON.stringify(theme, null, 2);
//     await fs.writeFile(
//       path.join(themesTargetPath, `${theme.name}.json`),
//       themeJson,
//       "utf8"
//     );
//   }
// };

// // ----------------------------------------------------------------------------
// // Build registry/styles/index.json.
// // Contains the list of all styles.
// //
// // Build registry/styles/[style]/index.json
// // Contains the list of all required deps for the specified style.
// //
// // Build registry/styles/[style]/[name].json
// // Style's component, hook or other entity.
// // ----------------------------------------------------------------------------
// const buildStyles = async () => {
//   const stylesPath = path.join(REGISTRY_PATH, "styles");
//   rimraf.sync(stylesPath);
//   if (!existsSync(stylesPath)) {
//     await fs.mkdir(stylesPath, { recursive: true });
//   }

//   for (const style of styles) {
//     const styleTargetPath = path.join(REGISTRY_PATH, "styles", style.name);

//     if (!existsSync(styleTargetPath)) {
//       await fs.mkdir(styleTargetPath, { recursive: true });
//     }

//     // ----------------------------------------------------------------------------
//     // Build registry/styles/[style]/index.json
//     // ----------------------------------------------------------------------------
//     const styleIndexJson = JSON.stringify(style, null, 2);
//     await fs.writeFile(
//       path.join(styleTargetPath, "index.json"),
//       styleIndexJson,
//       "utf8"
//     );

//     for (const item of [...core, ...lib]) {
//       let files;
//       if (item.files) {
//         files = await Promise.all(
//           item.files.map(async (_file) => {
//             const file =
//               typeof _file === "string"
//                 ? {
//                     path: _file,
//                     type: item.type,
//                     content: "",
//                     target: "",
//                   }
//                 : _file;

//             const content = await fs.readFile(
//               path.join(
//                 process.cwd(),
//                 "src",
//                 "registry",
//                 "ui",
//                 style.name,
//                 file.path
//               ),
//               "utf8"
//             );

//             return {
//               path: file.path,
//               type: file.type,
//               content: content,
//               target: file.target,
//             };
//           })
//         );
//       }

//       const payload = registryItemSchema.safeParse({
//         ...item,
//         files,
//       });

//       // ----------------------------------------------------------------------------
//       // Build registry/styles/[style]/[name].json
//       // ----------------------------------------------------------------------------
//       if (payload.success) {
//         await fs.writeFile(
//           path.join(styleTargetPath, `${item.name}.json`),
//           JSON.stringify(payload.data, null, 2),
//           "utf8"
//         );
//       }
//     }
//   }

//   // ----------------------------------------------------------------------------
//   // Build registry/styles/index.json.
//   // ----------------------------------------------------------------------------
//   const allStyles = styles.map((style) => ({
//     name: style.name,
//     label: style.label,
//     type: style.type,
//   }));

//   const stylesJson = JSON.stringify(allStyles, null, 2);
//   await fs.writeFile(
//     path.join(REGISTRY_PATH, "styles/index.json"),
//     stylesJson,
//     "utf8"
//   );
// };

// // ----------------------------------------------------------------------------
// // Build registry/hooks/index.json.
// // Contains the list of all hooks.
// //
// // Build registry/hooks/[name].json
// // Hook's entity.
// // ----------------------------------------------------------------------------
// const buildHooks = async () => {
//   const targetPath = path.join(REGISTRY_PATH, "hooks");
//   rimraf.sync(targetPath);
//   if (!existsSync(targetPath)) {
//     await fs.mkdir(targetPath, { recursive: true });
//   }

//   const allHooks = hooks.map((hook) => ({
//     name: hook.name,
//     label: hook.label ?? hook.name,
//   }));

//   // Build registry/hooks/index.json
//   const hooksJson = JSON.stringify(allHooks, null, 2);
//   await fs.writeFile(path.join(targetPath, "index.json"), hooksJson, "utf8");

//   // Build registry/hooks/[name].json
//   for (const item of hooks) {
//     let files;
//     if (item.files) {
//       files = await Promise.all(
//         item.files.map(async (_file) => {
//           const file =
//             typeof _file === "string"
//               ? {
//                   path: _file,
//                   type: item.type,
//                   content: "",
//                   target: "",
//                 }
//               : _file;

//           const content = await fs.readFile(
//             path.join(process.cwd(), "src", "registry", file.path),
//             "utf8"
//           );

//           return {
//             path: file.path,
//             type: file.type,
//             content: content,
//             target: file.target,
//           };
//         })
//       );
//     }

//     const payload = registryItemSchema.safeParse({
//       ...item,
//       files,
//     });

//     // ----------------------------------------------------------------------------
//     // Build registry/styles/[style]/[name].json
//     // ----------------------------------------------------------------------------
//     if (payload.success) {
//       await fs.writeFile(
//         path.join(targetPath, `${item.name}.json`),
//         JSON.stringify(payload.data, null, 2),
//         "utf8"
//       );
//     }
//   }
// };

const run = async () => {
  try {
    // const result = registrySchema.safeParse(registry);

    // if (!result.success) {
    //   console.error(result.error);
    //   process.exit(1);
    // }

    await buildRegistry();
    await buildCore();
    // await buildHooks();
    // await buildThemes();
    // await buildIcons();

    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
