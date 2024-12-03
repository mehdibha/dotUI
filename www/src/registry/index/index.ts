import { type Registry } from "@dotui/registry/types";
import { core } from "@/registry/index/core";
import { hooks } from "@/registry/index/hooks";
import { themes } from "@/registry/index/themes";

export const registry: Registry = [...core, ...hooks, ...themes];
