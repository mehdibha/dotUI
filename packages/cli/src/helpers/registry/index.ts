import { handleError } from "@/helpers/handle-error";
import { logger, highlight } from "@/utils";
import {
  iconLibariesSchema,
  registryIndexSchema,
  registryItemFileSchema,
  registryItemSchema,
  registryResolvedItemsTreeSchema,
  stylesSchema,
  templateSchema,
  themesSchema,
} from "./schema";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { z } from "zod";
import { Config } from "@/helpers/get-config";
import deepmerge from "deepmerge";

const REGISTRY_URL = "http://localhost:3000/registry";

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"]);
    return registryIndexSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
  }
}

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles/index.json"]);
    return stylesSchema.parse(result);
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
    return iconLibariesSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

export async function getRegistryThemes() {
  try {
    const [result] = await fetchRegistry(["themes/index.json"]);
    return themesSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

export async function getRegistryTemplate(name: string) {
  try {
    const [result] = await fetchRegistry([`templates/${name}.json`]);

    return templateSchema.parse(result);
  } catch (error) {
    logger.error("\n");
    handleError(error);
  }
}
export async function getRegistryItem(
  name: string,
  style: string,
  type?: "registry:core" | "registry:lib" | "registry:block" | "registry:component" | "registry:hook",
) {
  try {
    const [result] = await fetchRegistry([
      isUrl(name) ? name : `styles/${style}/${name}.json`,
    ]);
    return registryItemSchema.parse(result);
  } catch (error) {
    logger.break();
    handleError(error);
    return null;
  }
}

export async function resolveTree(
  index: z.infer<typeof registryIndexSchema>,
  names: string[]
) {
  const tree: z.infer<typeof registryIndexSchema> = [];

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name);

    if (!entry) {
      continue;
    }

    tree.push(entry);

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies);
      tree.push(...dependencies);
    }
  }

  return tree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  );
}

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined;

async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path);
        const response = await fetch(url, { agent });

        if (!response.ok) {
          const errorMessages: { [key: number]: string } = {
            400: "Bad request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not found",
            500: "Internal server error",
          };
          const result = await response.json();
          const message =
            result && typeof result === "object" && "error" in result
              ? result.error
              : response.statusText || errorMessages[response.status];
          throw new Error(
            `Failed to fetch from ${highlight.info(url)}.\n${message}`
          );
        }

        return response.json();
      })
    );

    return results;
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

function getRegistryUrl(path: string) {
  if (isUrl(path)) {
    const url = new URL(path);
    return url.toString();
  }

  return `${REGISTRY_URL}/${path}`;
}

function getRegistryItemPath(name: string, type: z.infer<typeof registryItemSchema>["type"]) {
  switch (type) {
    case "registry:core":
      return `${REGISTRY_URL}/core/${name}.json`;
    case "registry:lib":
      return `${REGISTRY_URL}/lib/${name}.json`;
    case "registry:block":
      return `${REGISTRY_URL}/blocks/${name}.json`;
    case "registry:component":
      return `${REGISTRY_URL}/components/${name}.json`;
    case "registry:hook":
      return `${REGISTRY_URL}/hooks/${name}.json`;
    case "registry:style":
      return `${REGISTRY_URL}/styles/${name}.json`;
    default:
      return `${REGISTRY_URL}/styles/${name}.json`;
  }
}

function isUrl(path: string) {
  try {
    new URL(path);
    return true;
  } catch (error) {
    return false;
  }
}

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
        names.map(async (name) => {
          const item = await getRegistryItem(name, config.style, index);
          return item;
        })
      )
    ).filter((item): item is NonNullable<typeof item> => item !== null);

    if (!items.length) {
      return null;
    }

    const registryDependencies: string[] = items
      .map((item) => item.registryDependencies ?? [])
      .flat();

    const uniqueDependencies = Array.from(new Set(registryDependencies));
    const urls = Array.from([...names, ...uniqueDependencies]).map((name) =>
      getRegistryUrl(isUrl(name) ? name : `styles/${config.style}/${name}.json`)
    );
    let result = await fetchRegistry(urls);
    const payload = z.array(registryItemSchema).parse(result);

    if (!payload) {
      return null;
    }

    // If we're resolving the index, we want it to go first.
    if (names.includes("index")) {
      const index = await getRegistryItem("index", config.style);
      if (index) {
        payload.unshift(index);
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
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}

export function getRegistryItemFileTargetPath(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config,
  override?: string
) {
  if (override) {
    return override;
  }

  if (file.type === "registry:core") {
    return config.resolvedPaths.core;
  }

  if (file.type === "registry:lib") {
    return config.resolvedPaths.lib;
  }

  if (file.type === "registry:block" || file.type === "registry:component") {
    return config.resolvedPaths.components;
  }

  if (file.type === "registry:hook") {
    return config.resolvedPaths.hooks;
  }

  // TODO: we put this in components for now.
  // We should move this to pages as per framework.
  if (file.type === "registry:page") {
    return config.resolvedPaths.components;
  }

  return config.resolvedPaths.components;
}
