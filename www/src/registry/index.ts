import { core } from "@/registry/registry-core";
import { hooks } from "@/registry/registry-hooks";
import { lib } from "@/registry/registry-lib";
import { themes } from "@/registry/registry-themes";
import { base } from "./registry-base";
import { RegistryItem, type Registry } from "./types";

export const registry: Registry = [
  ...base.map((item) => ({ ...item, type: "base" }) as RegistryItem),
  ...core.map((item) => ({ ...item, type: "core" }) as RegistryItem),
  ...hooks.map((item) => ({ ...item, type: "hook" }) as RegistryItem),
  ...themes.map((item) => ({ ...item, type: "theme" }) as RegistryItem),
  ...lib.map((item) => ({ ...item, type: "lib" }) as RegistryItem),
];
