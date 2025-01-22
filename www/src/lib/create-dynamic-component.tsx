import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Skeleton } from "@/registry/core/skeleton";

type Registry<T> = Record<string, React.ComponentType<T>>;

export const createDynamicComponent = <Props extends {}>(
  registryItem: string,
  componentName: string,
  DefaultComp: React.ComponentType<Props>,
  registry: Registry<Props>
): React.FC<Props> => {
  const Component: React.FC<Props> = (props) => {
    const { currentTheme } = useThemes();

    const currentThemeVariant = currentTheme.variants[registryItem];
    const { variants } = useComponentsVariants();
    const contextVariant = variants[registryItem];

    if (
      (!currentThemeVariant || !registry[currentThemeVariant]) &&
      (!contextVariant || !registry[contextVariant])
    ) {
      return <DefaultComp {...props} />;
    }

    const LazyComponent = registry[contextVariant ?? currentThemeVariant];

    return (
      <React.Suspense
        fallback={
          <Skeleton>
            <DefaultComp {...props} />
          </Skeleton>
        }
      >
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };

  Component.displayName = componentName;

  return Component;
};

const variantsContext = React.createContext<{
  variants: Record<string, string>;
  setVariants: (value: Record<string, string>) => void;
}>({ variants: {}, setVariants: () => {} });

export const VariantsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [variants, setVariants] = React.useState<Record<string, string>>({});
  return (
    <variantsContext.Provider value={{ variants, setVariants }}>
      {children}
    </variantsContext.Provider>
  );
};

export const useComponentsVariants = () => React.useContext(variantsContext);
