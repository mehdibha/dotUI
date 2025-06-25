import React from "react";

import type { Variants } from "@dotui/style-engine/types";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { useVariant } from "./variants-provider";

export const createDynamicComponent = <Props extends {}>(
  componentName: keyof Variants,
  slotName: string,
  DefaultComponent: React.FC<Props>,
  variants: Record<
    string,
    React.LazyExoticComponent<React.ComponentType<Props>>
  >,
  shouldWrapWithSuspense = true,
): React.FC<Props> => {
  const Component = (props: Props) => {
    const variantName = useVariant(componentName);

    if (!variantName) {
      return <DefaultComponent {...props} />;
    }

    const LazyComponent = variants[variantName];

    if (!LazyComponent) {
      return <DefaultComponent {...props} />;
    }

    if (shouldWrapWithSuspense) {
      return (
        <React.Suspense
          fallback={
            <Skeleton>
              <DefaultComponent {...props} />
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
