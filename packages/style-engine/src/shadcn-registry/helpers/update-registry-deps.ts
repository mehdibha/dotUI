import type { RegistryItem } from "shadcn/registry";

import type { Style } from "../../types";

export const updateRegistryDependencies = (
  registryItem: RegistryItem,
  options: {
    styleName: string;
    baseUrl: string;
    style: Style;
  },
): RegistryItem => {
  const { styleName, baseUrl } = options;

  return {
    ...registryItem,
    registryDependencies: registryItem.registryDependencies?.map(
      (dep) => `${baseUrl}/${styleName}/${dep}`,
    ),
  };
};
