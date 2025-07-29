import type { RegistryItem } from "shadcn/registry";

import type { Style } from "../../types";

export const updateRegistryDependencies = (
  registryItem: RegistryItem,
  baseUrl: string,
  style: Style,
): RegistryItem => {
  return {
    ...registryItem,
    registryDependencies: registryItem.registryDependencies?.map(
      (dep) => `${baseUrl}/${style.name}/${dep}`,
    ),
  };
};
