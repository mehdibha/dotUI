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

    if (!LazyComponent) {
      return <DefaultComponent {...props} />;
    }

    if (disableSuspense) {
      return (
        <ErrorBoundary
          fallback={
            <Error
              componentName={componentName}
              slotName={slotName}
              variantName={variantName}
            />
          }
        >
          <LazyComponent {...props} />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary
        fallback={
          <Error
            componentName={componentName}
            slotName={slotName}
            variantName={variantName}
          />
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
          <DisableSuspense>
            <LazyComponent {...props} />
          </DisableSuspense>
        </React.Suspense>
      </ErrorBoundary>
    );
  };
  Component.displayName = slotName;

  return Component;
};

const DisableSuspenseContext = React.createContext<boolean>(false);

const DisableSuspense = ({ children }: { children?: React.ReactNode }) => {
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
        "bg-bg-muted relative block h-6 animate-pulse rounded-md",
        props.children && "h-auto text-transparent *:invisible",
        className,
      )}
      {...props}
    />
  );
}

function Error({
  componentName,
  slotName,
  variantName,
}: {
  componentName: string;
  slotName: string;
  variantName: string;
}) {
  return (
    <div className="border-border-danger flex items-center justify-center rounded-md border p-4">
      <div className="border-border-danger bg-bg-danger-muted text-fg-danger flex items-start gap-2 rounded-md p-2 text-sm">
        <AlertCircleIcon />
        <div>
          <span className="font-bold">Error rendering dynamic component:</span>
          <ul>
            <li>
              <span className="font-bold">component:</span> {componentName}
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
  );
}
