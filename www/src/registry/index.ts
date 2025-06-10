import type { RegistryItem } from "./types";
import { hooks } from "./registry-hooks";
import { lib } from "./registry-lib";
import { ui } from "./registry-ui";

export const registry: RegistryItem[] = [...ui, ...hooks, ...lib];
