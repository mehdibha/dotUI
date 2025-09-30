import type { Registry } from "shadcn/schema";

import { base } from "./base/registry";
import { registryBlocks } from "./blocks/registry";
import { hooks } from "./hooks/registry";
import { lib } from "./lib/registry";
import { registryUi } from "./ui/registry";

export const registry: Registry["items"] = [
  base,
  ...registryUi,
  ...registryBlocks,
  ...hooks,
  ...lib,
];
