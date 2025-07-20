import React from "react";
import { AlertCircleIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { DEFAULT_VARIANTS_DEFINITION } from "@dotui/style-engine/constants";
import { cn } from "@dotui/ui/lib/utils";
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

    return (
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center rounded-md border border-border-danger p-4">
            <div className="flex items-start gap-2 rounded-md border-border-danger bg-bg-danger-muted p-2 text-sm text-fg-danger">
              <AlertCircleIcon />
              <div>
                <span className="font-bold">
                  Error rendering dynamic component:
                </span>
                <ul>
                  <li>
                    <span className="font-bold">component:</span>{" "}
                    {componentName}
                  </li>
                  <li>
                    <span className="font-bold">slot:</span> {slotName}
                  </li>
                  <li>
                    <span className="font-bold">variant:</span> {variantName}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        }
      >
        <React.Suspense
          fallback={
            <Skeleton>
              <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
                <DefaultComponent {...props} />
              </VariantsProvider>
            </Skeleton>
          }
        >
          {/* @ts-expect-error: we need to disable suspense for the children or resolving the children before the root can cause errors */}
          {props?.children ? (
            <LazyComponent {...props}>
              {/* @ts-expect-error: we need to disable suspense for the children or resolving the children before the root can cause errors */}
              <DisableSuspense>{props.children}</DisableSuspense>
            </LazyComponent>
          ) : (
            <LazyComponent {...props} />
          )}
        </React.Suspense>
      </ErrorBoundary>
    );
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

function Skeleton({
  className,
  show = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
}) {
  if (!show) return props.children;
  return (
    <div
      className={cn(
        "relative block h-6 animate-pulse rounded-md bg-bg-muted",
        props.children && "h-auto text-transparent *:invisible",
        className,
      )}
      {...props}
    />
  );
}
