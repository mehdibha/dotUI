import { hooks } from "./registry-hooks";
import { lib } from "./registry-lib";
import { ui } from "./registry-ui";
import type { RegistryItem } from "./types";

export const registry: RegistryItem[] = [...ui, ...hooks, ...lib];
