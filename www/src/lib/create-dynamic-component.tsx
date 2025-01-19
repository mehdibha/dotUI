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
    const { variants } = useComponentsVariants();
    const contextVariant = variants[registryItem];

    if (!variant || !registry[variant]) {
      throw new Error(
        `Variant "${variant}" for component "${componentName}" not found in the registry.`
      );
    }

    const LazyComponent = registry[contextVariant ?? variant];

    return <LazyComponent {...props} />;
    // return (
    //   <React.Suspense fallback={null}>
    //     <LazyComponent {...props} />
    //   </React.Suspense>
    // );
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

// const LazyLoaderContext = React.createContext<{
//   isLoading: boolean;
//   setLoading: (value: boolean) => void;
// }>({
//   isLoading: true,
//   setLoading: () => {},
// });
// const LazyLoader = ({ children }: { children: React.ReactNode }) => {
//   const [isLoading, setLoading] = React.useState(true);
//   return (
//     <LazyLoaderContext value={{ isLoading, setLoading }}>
//       <React.Suspense fallback={children}>{children}</React.Suspense>
//     </LazyLoaderContext>
//   );
// };
