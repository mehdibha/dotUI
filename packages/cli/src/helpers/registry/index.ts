import { RegistryItemFile, RegistryItemType } from "@dotui/registry/types";
import { handleError } from "@/helpers/handle-error";
import { logger } from "@/utils";
import { fetchRegistry } from "./utils";
import {
  registryItemSchema,
  registrySchema,
  registryTemplatesSchema,
  registryIconLibrariesSchema,
  registryResolvedItemsTreeSchema,
} from "@dotui/registry/schema";
import { z } from "zod";
import { Config } from "@/helpers/get-config";
import { isUrl } from "@/helpers/is-url";
import deepmerge from "deepmerge";

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"]);
    return registrySchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
  }
}

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles/index.json"]);
    console.log(result);
    return registrySchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

export async function getRegistryColorSystems() {
  return [
    {
      name: "default",
      label: "Default",
    },
    {
      name: "color-scales",
      label: "With color scales (recommended)",
    },
    {
      name: "minimal",
      label: "Minimal (shadcn color system)",
    },
  ];
}

export async function getRegistryIconLibrairies() {
  try {
    const [result] = await fetchRegistry(["icons/index.json"]);
    return registryIconLibrariesSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

export async function getRegistryThemes() {
  try {
    const [result] = await fetchRegistry(["themes/index.json"]);
    return registrySchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

export async function getRegistryTemplate(name: string) {
  try {
    const [result] = await fetchRegistry([`templates/${name}.json`]);
    return registryTemplatesSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
  }
}

export async function getRegistryItem(path: string) {
  try {
    const [result] = await fetchRegistry([path]);
    return registryItemSchema.parse(result);
  } catch (error) {
    logger.break();
    handleError(error);
    return null;
  }
}

const getRegistryItemPath = (
  name: string,
  type: RegistryItemType,
  style: string
) => {
  if (isUrl(name)) {
    return name;
  }
  switch (type) {
    case "registry:style":
      return `styles/${style}/index.json`;
    case "registry:core":
      return `styles/${style}/${name}.json`;
    case "registry:hook":
      return `hooks/${name}.json`;
    case "registry:theme":
      return `themes/${name}.json`;
    default:
      return `styles/${style}/${name}.json`;
  }
};

export async function registryResolveItemsTree(
  names: z.infer<typeof registryItemSchema>["name"][],
  config: Config
) {
  try {
    const index = await getRegistryIndex();
    if (!index) {
      return null;
    }

    let items = (
      await Promise.all(
        names
          .map(async (name) => {
            const indexedItem = index.find((elem) => elem.name === name);
            if (!indexedItem) return null;
            const path = getRegistryItemPath(
              name,
              indexedItem.type,
              config.style
            );
            const item = await getRegistryItem(path);
            return item;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      )
    ).filter((item): item is NonNullable<typeof item> => item !== null);

    if (!items.length) {
      return null;
    }

    const registryDependencies: string[] = items
      .map((item) => item.registryDependencies ?? [])
      .flat();

    const uniqueDependencies = Array.from(new Set(registryDependencies));
    const urls = Array.from([...names, ...uniqueDependencies])
      .map((name) => {
        const indexedItem = index.find((elem) => elem.name === name);
        if (!indexedItem) return null;
        return getRegistryItemPath(name, indexedItem.type, config.style);
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    let result = await fetchRegistry(urls);
    const payload = z.array(registryItemSchema).parse(result);

    if (!payload) {
      return null;
    }

    // If we're resolving the index, we want it to go first.
    if (names.includes("index")) {
      const indexStylePath = getRegistryItemPath(
        "index",
        "registry:style",
        config.style
      );
      const indexStyle = await getRegistryItem(indexStylePath);
      if (indexStyle) {
        payload.unshift(indexStyle);
      }
    }

    let tailwind = {};
    payload.forEach((item) => {
      tailwind = deepmerge(tailwind, item.tailwind ?? {});
    });

    let cssVars = {};
    payload.forEach((item) => {
      cssVars = deepmerge(cssVars, item.cssVars ?? {});
    });

    let docs = "";
    payload.forEach((item) => {
      if (item.docs) {
        docs += `${item.docs}\n`;
      }
    });

    return registryResolvedItemsTreeSchema.parse({
      dependencies: deepmerge.all(
        payload.map((item) => item.dependencies ?? [])
      ),
      devDependencies: deepmerge.all(
        payload.map((item) => item.devDependencies ?? [])
      ),
      files: deepmerge.all(payload.map((item) => item.files ?? [])),
      tailwind,
      cssVars,
      docs,
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}

export function getRegistryItemFileTargetPath(
  file: RegistryItemFile,
  config: Config,
  override?: string
) {
  if (override) {
    return override;
  }

  switch (file.type) {
    case "registry:core":
      return config.resolvedPaths.core;
    case "registry:lib":
      return config.resolvedPaths.lib;
    case "registry:component":
      return config.resolvedPaths.components;
    case "registry:hook":
      return config.resolvedPaths.hooks;
    default:
      return config.resolvedPaths.components;
  }
}
