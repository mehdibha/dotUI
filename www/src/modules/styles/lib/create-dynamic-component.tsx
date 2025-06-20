import type { Components } from "@/modules/styles/types";
import React from "react";

import { Skeleton } from "@dotui/ui/components/skeleton";

import { useCurrentComponents } from "../contexts/components-context";

type Registry<T> = Record<
  string,
  React.LazyExoticComponent<React.FunctionComponent<T>>
>;

export const createDynamicComponent = <Props extends {}>(
  componentName: keyof Components,
  slotName: string,
  FallbackComponent: React.FC<Props>,
  registry: Registry<Props>,
): React.FC<Props> => {
  const Component = (props: Props) => {
    const components = useCurrentComponents();

    const componentStyle = components[componentName];
    const shouldWrapWithSuspense = true;

    if (!componentStyle) {
      return <FallbackComponent {...props} />; // No need to wrap it inside Suspense, default component should always be imported normally
    }

    const LazyComponent = registry[componentStyle];

    if (!LazyComponent) {
      // console.warn(
      //   `Component ${componentName}/${slotName}/${componentStyle} not found in registry`
      // );
      return <FallbackComponent {...props} />;
    }

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
  Component.displayName = slotName;

  return Component;
};
