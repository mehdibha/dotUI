import { useThemes } from "@/hooks/use-themes";

type StyleFunction = (...args: any[]) => string;
type StyleRegistry<T extends StyleFunction> = Record<string, T>;

export const createDynamicStyles = <T extends StyleFunction>(
  registryItem: string,
  styleRegistry: StyleRegistry<T>
): T => {
  return ((...args: Parameters<T>) => {
    const { currentTheme } = useThemes();
    const variant = currentTheme.variants[registryItem];

    if (!variant || !styleRegistry[variant]) {
      throw new Error(
        `Style variant "${variant}" for "${registryItem}" not found in the registry.`
      );
    }

    const styleFunction = styleRegistry[variant];
    return styleFunction(...args);
  }) as T;
};
