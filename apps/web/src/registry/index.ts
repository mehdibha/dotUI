import { blocks } from "@/registry/blocks";
import { core } from "@/registry/core";
import { demos } from "@/registry/demos";
import { hooks } from "@/registry/hooks";
import { lib } from "@/registry/lib";
import { Registry } from "@/registry/schema";
import { themes } from "@/registry/themes";

export const registry: Registry = [
  ...core,
  ...demos,
  ...blocks,
  ...lib,
  ...hooks,
  ...themes,
];
