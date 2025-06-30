import type { Registry } from "shadcn/registry";

import { base } from "./registry-base";
import { hooks } from "./registry-hooks";
import { lib } from "./registry-lib";
import { ui } from "./registry-ui";

export const registry: Registry["items"] = [base, ...ui, ...hooks, ...lib];
