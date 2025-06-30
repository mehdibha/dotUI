import type { RegistryItem } from "shadcn/registry";

import type { Style } from "../../types";

export const updateRegistryDependencies = (
  registryItem: RegistryItem,
  baseUrl: string,
  style: Style,
): void => {
  registryItem.registryDependencies = registryItem.registryDependencies?.map(
    (dep) => {
      return `${baseUrl}/${style.slug}/${dep}`;
    },
  );
};
