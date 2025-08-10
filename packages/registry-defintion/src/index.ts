import type { Registry } from "shadcn/registry";

import { base } from "./registry-base";
import { hooks } from "./registry-hooks";
import { lib } from "./registry-lib";
import { registryUi } from "./registry-ui";

export const registry: Registry["items"] = [
  base,
  ...registryUi,
  ...hooks,
  ...lib,
];
