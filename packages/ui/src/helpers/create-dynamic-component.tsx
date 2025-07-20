import React from "react";

import {
  DEFAULT_VARIANTS,
  DEFAULT_VARIANTS_DEFINITION,
} from "@dotui/style-engine/constants";
import { Skeleton } from "@dotui/ui/components/skeleton";
import type { Variants } from "@dotui/style-engine/types";

import { useVariant, VariantsProvider } from "./variants-provider";

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
    const disableSuspense = useDisableSuspense();

    if (!variantName) {
      return <DefaultComponent {...props} />;
    }

    const LazyComponent = variants[variantName];

    if (!LazyComponent || disableSuspense) {
      return <DefaultComponent {...props} />;
    }

    if (shouldWrapWithSuspense) {
      return (
        <React.Suspense
          fallback={
            <Skeleton>
              <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
                <DefaultComponent {...props} />
              </VariantsProvider>
            </Skeleton>
          }
        >
          <LazyComponent {...props}>
            <DisableSuspense>
              {/* @ts-expect-error: we need to disable suspense for the children or resolving the children before the root can cause errors */}
              {props?.children}
            </DisableSuspense>
          </LazyComponent>
        </React.Suspense>
      );
    }

    return <LazyComponent {...props} />;
  };
  Component.displayName = slotName;

  return Component;
};

const DisableSuspenseContext = React.createContext<boolean>(false);

const DisableSuspense = ({ children }: { children: React.ReactNode }) => {
  return (
    <DisableSuspenseContext value={true}>{children}</DisableSuspenseContext>
  );
};

const useDisableSuspense = () => {
  return React.useContext(DisableSuspenseContext);
};
