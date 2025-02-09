import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Skeleton } from "@/registry/core/skeleton_basic";

type Registry<T> = Record<string, React.ComponentType<T>>;

export const createDynamicComponent = <Props extends {}>(
  registryItem: string,
  componentName: string,
  DefaultComp: React.ComponentType<Props>,
  registry: Registry<Props>
): React.FC<Props> => {
  const Component: React.FC<Props> = (props) => {
    const { currentTheme } = useThemes();
    const demosContext = useDemosContext();
    const shouldWrapWithSuspense = !!demosContext;

    const currentThemeVariant = currentTheme.variants[registryItem];
    const { variants } = useComponentsVariants();
    const contextVariant = variants[registryItem];

    if (
      (!currentThemeVariant || !registry[currentThemeVariant]) &&
      (!contextVariant || !registry[contextVariant])
    ) {
      return <DefaultComp {...props} />;
    }

    // @ts-expect-error TODO fix later
    const LazyComponent = registry[contextVariant ?? currentThemeVariant];

    if (shouldWrapWithSuspense) {
      return (
        <React.Suspense
          fallback={
            <Skeleton show>
              <DefaultComp {...props} />
            </Skeleton>
          }
        >
          <LazyComponent {...props} />
        </React.Suspense>
      );
    }
    return <LazyComponent {...props} />;
  };

  Component.displayName = componentName;

  return Component;
};

const VariantsContext = React.createContext<{
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
    <VariantsContext value={{ variants, setVariants }}>
      {children}
    </VariantsContext>
  );
};

export const useComponentsVariants = () => React.useContext(VariantsContext);

const DemosContext = React.createContext<true | null>(null);

export const DemosProvider = ({ children }: { children: React.ReactNode }) => {
  return <DemosContext value>{children}</DemosContext>;
};

export const useDemosContext = () => React.useContext(DemosContext);
