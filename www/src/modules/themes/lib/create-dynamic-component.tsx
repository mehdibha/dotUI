import React from "react";
import { Primitives } from "@dotui/schemas";
import { Skeleton } from "@/registry/core/skeleton_basic";
import { useCurrentTheme } from "@/modules/themes/atoms/themes-atom";
import { useLocalPrimitives } from "@/modules/themes/contexts/primitives-context";

type Registry<T> = Record<
  string,
  React.LazyExoticComponent<React.FunctionComponent<T>>
>;

export const createDynamicComponent = <Props extends {}>(
  primitiveName: keyof Primitives,
  componentName: string,
  FallbackComponent: React.FC<Props>,
  registry: Registry<Props>
): React.FC<Props> => {
  const Component = (props: Props) => {
    const { currentTheme } = useCurrentTheme();
    const { primitives: localPrimitives } = useLocalPrimitives();
    console.log("local primitives", localPrimitives);
    const currentThemePrimitive = currentTheme?.primitives?.[primitiveName];
    const localPrimitive = localPrimitives[primitiveName];
    // console.log("CURRENT THEME LOCAL PRIMITIVE", currentThemePrimitive);
    const resolvedPrimitive = localPrimitive ?? currentThemePrimitive;
    // console.log("RESOLVED PRIMITIVE", resolvedPrimitive);
    const shouldWrapWithSuspense = true;

    if (!resolvedPrimitive) {
      return <FallbackComponent {...props} />; // No need to wrap it inside Suspense, default component should always be imported normally
    }

    const LazyComponent = registry[resolvedPrimitive];

    if (!LazyComponent)
      throw new Error(
        `Component ${componentName} not found in registry of ${primitiveName}`
      );

    if (shouldWrapWithSuspense) {
      return (
        <React.Suspense
          fallback={
            <Skeleton>
              {/* We put the default component here to preserve the layout */}
              <FallbackComponent {...props} />
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
