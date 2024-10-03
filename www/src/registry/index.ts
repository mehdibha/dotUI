import { type Registry } from "@dotui/registry/types";
import { blocks } from "@/registry/blocks";
import { core } from "@/registry/core";
import { hooks } from "@/registry/hooks";
import { themes } from "@/registry/themes";

export const registry: Registry = [...core, ...hooks, ...themes, ...blocks];
