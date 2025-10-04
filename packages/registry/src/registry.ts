import type { RegistryItem } from "@dotui/registry/types";

import { registryBase } from "./base/registry";
import { registryBlocks } from "./blocks/registry";
import { registryHooks } from "./hooks/registry";
import { registryLib } from "./lib/registry";
import { registryUi } from "./ui/registry";

export const registry: RegistryItem[] = [
  ...registryBase,
  ...registryUi,
  ...registryBlocks,
  ...registryHooks,
  ...registryLib,
];
