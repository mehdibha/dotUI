import { type Registry } from "@dotui/registry/types";
import { core } from "@/registry-v2/index/core";
import { hooks } from "@/registry-v2/index/hooks";
import { themes } from "@/registry-v2/index/themes";

export const registry: Registry = [...core, ...hooks, ...themes];
