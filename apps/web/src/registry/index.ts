import { Registry } from "@/registry/schema"
import { core } from "@/registry/core"
import { demos } from "@/registry/demos"
import { hooks } from "@/registry/hooks"
import { lib } from "@/registry/lib"
import { themes } from "@/registry/themes"
import { blocks } from "@/registry/blocks"

export const registry: Registry = [
  ...core,
  ...demos,
  ...blocks,
  ...lib,
  ...hooks,
  ...themes,
]