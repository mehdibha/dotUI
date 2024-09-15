import { existsSync, promises as fs } from "fs";
import path from "path";
import { rimraf } from "rimraf";
import { registry } from "@/registry";
import { iconLibraries, icons } from "@/registry/icons";
import { registrySchema } from "@/registry/schema";

const REGISTRY_PATH = path.join(process.cwd(), "public/registry");

// ----------------------------------------------------------------------------
// Build registry/index.json.
// Contains the list of all components, hooks, etc.
// ----------------------------------------------------------------------------
const buildRegistry = async () => {};

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

  // Build registry/icons/index.json
  const iconLibrariesJson = JSON.stringify(iconLibraries, null, 2);
  await fs.writeFile(
    path.join(targetPath, "index.json"),
    iconLibrariesJson,
    "utf8"
  );

  // Build registry/icons/[iconLibrary].json
  for (const iconLibrary of iconLibraries) {
    const libIcons = Object.entries(icons).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        acc[key] = value[iconLibrary.name as keyof typeof value];
        return acc;
      },
      {}
    );

    const payload = {
      name: iconLibrary.name,
      dependency: iconLibrary.dependency,
      icons: libIcons,
    };

    const iconLibraryJson = JSON.stringify(payload, null, 2);
    await fs.writeFile(
      path.join(targetPath, `${iconLibrary.name}.json`),
      iconLibraryJson,
      "utf8"
    );
  }

  // Build __icons__/index.tsx
  const iconsIndexPath = path.join(process.cwd(), "src", "__icons__");
  rimraf.sync(iconsIndexPath);
  if (!existsSync(iconsIndexPath)) {
    await fs.mkdir(iconsIndexPath, { recursive: true });
  }

  let iconsIndexContent = `"use client";

${iconLibraries.map((lib) => `import * as ${lib.name} from "${lib.import}";`).join("\n")}
import { createIcon } from "@/lib/create-icon";

`;

  for (const [iconName, iconVariants] of Object.entries(icons)) {
    iconsIndexContent += `export const ${iconName} = createIcon({
  ${iconLibraries.map((lib) => `${lib.name}: ${lib.name}.${iconVariants[lib.name as keyof typeof iconVariants]}`).join(",\n  ")}
});\n\n`;
  }

  await fs.writeFile(
    path.join(iconsIndexPath, "index.tsx"),
    iconsIndexContent,
    "utf8"
  );
};

// ----------------------------------------------------------------------------
// Build registry/themes/index.json.
// Contains the list of all themes.
//
// Build registry/themes/[name].json
// Contains theme's variables.
// ----------------------------------------------------------------------------
const buildThemes = async () => {
  const themesTargetPath = path.join(REGISTRY_PATH, "themes")
  rimraf.sync(themesTargetPath)
  if (!existsSync(themesTargetPath)) {
    await fs.mkdir(themesTargetPath, { recursive: true })
  }
};

// ----------------------------------------------------------------------------
// Build registry/styles/index.json.
// Contains the list of all styles.
//
// Build registry/styles/[style]/index.json
// Contains the list of all required deps for the specified style.
//
// Build registry/styles/[style]/[name].json
// Style's component, hook or other entity.
// ----------------------------------------------------------------------------
const buildStyles = async () => {};

// ----------------------------------------------------------------------------
// Build registry/hooks/index.json.
// Contains the list of all hooks.
//
// Build registry/hooks/[name].json
// Hook's entity.
// ----------------------------------------------------------------------------
const buildHooks = async () => {};

// ----------------------------------------------------------------------------
// Build registry/templates/index.json.
// Contains the list of all templates.
//
// Build registry/templates/[name].json
// Template's entity.
// ----------------------------------------------------------------------------
const buildTemplates = async () => {};

const run = async () => {
  try {
    const result = registrySchema.safeParse(registry);

    if (!result.success) {
      console.error(result.error);
      process.exit(1);
    }

    await buildIcons();
    // await buildDemos();
    // await buildRegistry(result.data);
    // await buildStyles(result.data);
    // await buildStylesIndex();
    // await buildThemes()

    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
