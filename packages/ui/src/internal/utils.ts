import React from "react";

import { ui } from "@/registry/registry-ui";

export const getComponentVariants = (componentName: string) => {
  const component = ui.find((c) => c.name === componentName);
  if (!component) {
    return [];
  }
  if ("styles" in component) {
    return component.styles.map((style) => style.name);
  }
  return [];
};
export const createDynamicVariants = <Props extends {}>(
  componentName: string,
  componentSlot = "Alert",
): Record<string, React.LazyExoticComponent<React.ComponentType<Props>>> => {
  const variants = getComponentVariants(componentName);

  return variants.reduce(
    (acc, variant) => {
      acc[variant] = React.lazy(() =>
        import(`@/registry/components/${componentName}/${variant}`).then(
          (mod) => ({
            default: mod[componentSlot],
          }),
        ),
      );
      return acc;
    },
    {} as Record<string, React.LazyExoticComponent<React.ComponentType<Props>>>,
  );
};
