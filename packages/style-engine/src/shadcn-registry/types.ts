import type { RegistryItem } from "shadcn/registry";

import type { Style, Variants } from "../types";

export type { RegistryItem };

export interface RegistryContext {
  style: Style;
  styleName: string;
  baseUrl: string;
}

export type RegistryType = "base" | "theme" | keyof Variants;
