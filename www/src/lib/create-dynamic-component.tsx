import React from "react";
import { useThemes } from "@/hooks/use-themes";

type Registry<T> = Record<string, React.ComponentType<T>>;

export const createDynamicComponent = <Props extends {}>(
  registryItem: string,
  componentName: string,
  registry: Registry<Props>
): React.FC<Props> => {
  const Component: React.FC<Props> = (props) => {
    const { currentTheme } = useThemes();

    const variant = currentTheme.variants[registryItem];

    if (!variant || !registry[variant]) {
      throw new Error(
        `Variant "${variant}" for component "${componentName}" not found in the registry.`
      );
    }

    const LazyComponent = registry[variant];

    return (
      <React.Suspense fallback={null}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };

  Component.displayName = componentName;

  return Component;
};
