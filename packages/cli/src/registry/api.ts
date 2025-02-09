import {
  registryIndexSchema,
  RegistryItem,
  registryItemSchema,
  registryResolvedItemsTreeSchema,
  type RegistryItemType,
} from "@dotui/schemas";
import deepmerge from "deepmerge";
import { z } from "zod";
import { fetchRegistry } from "./helpers";

interface Config {
  primitives?: Record<string, string>;
}

export async function getRegistryIndex() {
  const [result] = await fetchRegistry(["index.json"]);
  return registryIndexSchema.parse(result);
}

const getPrimitivePath = (name: string, type: RegistryItemType) => {
  if (type === "base") return `base.json`;
  if (type === "core") return `core/${name}.json`;
  if (type === "component") return `components/${name}.json`;
  if (type === "hook") return `hooks/${name}.json`;
  if (type === "lib") return `lib/${name}.json`;
  if (type === "theme") return `themes/${name}.json`;
  throw new Error(`Invalid registry item type: ${type}`);
};

export async function resolvePrimitives(names: string[], config: Config) {
  const index = await getRegistryIndex();

  const iconLibraryDeps: string[] = [];
  const getAllRegistryDeps = (name: string) => {
    let registryDeps: string[] = [name];
    const item = index.find((item) => item.name === name);
    if (!item) throw new Error(`${name} not found in registry`);
    if (item.type === "icon-library") {
      if (item.deps) {
        iconLibraryDeps.push(item.deps[0]);
      }
      return [];
    }
    if (item.variants) {
      // we check if the variant is defined in the config, if not we use the first one (supposed to be the default)
      const variant = config.primitives?.[name] ?? item.variants[0];

      registryDeps = [
        ...registryDeps,
        ...getAllRegistryDeps(`${item.name}_${variant}`),
      ];
    }
    if (item.registryDeps) {
      registryDeps = [
        ...registryDeps,
        ...(item.registryDeps
          .flatMap((dep) => getAllRegistryDeps(dep))
          .filter(Boolean) as string[]),
      ];
    }

    return registryDeps;
  };

  const primitives: string[] = Array.from(
    new Set(names.flatMap((name) => getAllRegistryDeps(name)))
  );

  const skipped: RegistryItem[] = [];
  const primitivesPaths = primitives.map((name) => {
    const item = index.find((item) => item.name === name);
    if (!item) throw new Error(`${name} not found in registry`);
    if (item.type === "icon-library") skipped.push(item);
    return getPrimitivePath(name, item.type);
  });

  const result = await fetchRegistry(primitivesPaths);
  const payload = z.array(registryItemSchema).parse([...result, ...skipped]);

  if (!payload) {
    throw new Error("Failed to validate registry items"); // TODO: fix
  }

  const deps = deepmerge.all([
    ...payload.map((item) => item.deps ?? []),
    iconLibraryDeps,
  ]);
  const files = deepmerge.all(payload.map((item) => item.files ?? []));

  return registryResolvedItemsTreeSchema.parse({
    files: files ?? [],
    deps: deps ?? [],
  });
}
