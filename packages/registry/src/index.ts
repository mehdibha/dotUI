import type { RegistryItem } from "@dotui/registry/types";

import { registryBase } from "./base/registry";
import { registryHooks } from "./hooks/registry";
import { registryLib } from "./lib/registry";
import { registryUi } from "./ui/registry";

/**
 * Combined registry of all items (UI, base, lib, hooks)
 */
export const registry: RegistryItem[] = [
  ...registryBase,
  ...registryUi,
  ...registryLib,
  ...registryHooks,
];

export { registryBase } from "./base/registry";
export { registryHooks } from "./hooks/registry";
export { registryLib } from "./lib/registry";
export { registryUi } from "./ui/registry";
