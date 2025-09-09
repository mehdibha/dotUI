import type { Registry } from "shadcn/schema";

import { base } from "@dotui/registry-definition/registry-base";
import { iconLibraries } from "@dotui/registry-definition/registry-icons";

import type { Style } from "../../types";

export function generateRegistry(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): Registry {
  return {
    name: "dotui",
    homepage: "https://dotui.org/",
    items: [],
  };
}
