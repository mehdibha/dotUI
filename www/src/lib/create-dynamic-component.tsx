import React from "react";
import { useThemes } from "@/hooks/use-themes";

type Registry = Record<string, () => Promise<any>>;

export const createDynamicComponent = <Props extends {}>(
  registryItem: string,
  componentName: string,
  registry: Registry
) => {
  const Component: React.FC<Props> = (props) => {
    const { currentTheme } = useThemes();

    const variant = currentTheme.variants[registryItem];

    if (!variant || !registry[variant]) {
      throw new Error(
        `Variant "${variant}" for component "${componentName}" not found in the registry.`
      );
    }

    const LazyComponent = React.lazy(() =>
      registry[variant]().then((module) => {
        const exportComponent = module[componentName];
        if (!exportComponent) {
          throw new Error(
            `Component "${componentName}" not found in module for variant "${variant}".`
          );
        }
        return { default: exportComponent };
      })
    );

    return (
      <React.Suspense>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };

  Component.displayName = componentName;

  return Component;
};
