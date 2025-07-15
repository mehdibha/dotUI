import type { RegistryItem } from "shadcn/registry";

import { base } from "@dotui/registry-definition/registry-base";
import { iconLibraries } from "@dotui/registry-definition/registry-icons";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryBase(options: {
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { baseUrl, style } = options;

  let registryItem = base;

  registryItem = updateRegistryDependencies(base, baseUrl, style);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const iconLibrary = iconLibraries.find(
    (lib) => lib.name === style.icons.library,
  )!;

  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
