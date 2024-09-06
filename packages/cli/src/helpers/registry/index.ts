import { handleError } from "@/helpers/handle-error";
import { logger, highlight } from "@/utils";
import {
  iconLibariesSchema,
  registryIndexSchema,
  registryItemSchema,
  stylesSchema,
  themesSchema,
} from "./schema";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { z } from "zod";

// TODO: fix this
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
      name: "dotui-palettes",
      label: "with color palettes (recommended)",
    },
    {
      name: "dotui-basic",
      label: "without color palettes",
    },
    {
      name: "minimal",
      label: "minimal (shadcn color system)",
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

export async function getRegistryItem(name: string, style: string) {
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

function isUrl(path: string) {
  try {
    new URL(path);
    return true;
  } catch (error) {
    return false;
  }
}
