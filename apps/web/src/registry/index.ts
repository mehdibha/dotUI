import { blocks } from "@/registry/blocks";
import { core } from "@/registry/core";
import { hooks } from "@/registry/hooks";
import { type Registry } from "@/registry/schema";
import { themes } from "@/registry/themes";

export const registry: Registry = [...core, ...hooks, ...themes, ...blocks];
