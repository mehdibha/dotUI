import { registryIndexSchema, type RegistryItemType } from "@dotui/registry";
import { handleError } from "@/helpers/handle-error";
import { fetchRegistry } from "./helpers";

export async function getRegistryIndex() {
  const [result] = await fetchRegistry(["index.json"]);
  return registryIndexSchema.parse(result);
}

const getRegistryItemPath = (name: string, type: RegistryItemType) => {
  if (type === "base") return `base.json`;
  if (type === "core") return `core/${name}.json`;
  if (type === "component") return `components/${name}.json`;
  if (type === "hook") return `hooks/${name}.json`;
  if (type === "lib") return `lib/${name}.json`;
  if (type === "theme") return `themes/${name}.json`;
  throw new Error(`Invalid registry item type: ${type}`);
};

export async function getRegistryItem(name: string, type: RegistryItemType) {
  try {
    const path = getRegistryItemPath(name, type);
    const [result] = await fetchRegistry([path]);
    console.log(result);
  } catch (error) {
    handleError(error);
  }
}
