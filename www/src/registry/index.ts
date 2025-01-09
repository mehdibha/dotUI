import { type Registry } from "@dotui/registry/types";
import { core } from "@/registry/registry-core";
import { hooks } from "@/registry/registry-hooks";
import { themes } from "@/registry/registry-themes";

export const registry: Registry = [...core, ...hooks, ...themes];
