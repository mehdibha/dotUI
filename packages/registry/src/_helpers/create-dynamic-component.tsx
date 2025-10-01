import React from "react";
import { AlertCircleIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { DEFAULT_VARIANTS_DEFINITION } from "@dotui/registry/_style-system/constants";
import { cn } from "@dotui/registry/lib/utils";
import type { Variants } from "@dotui/registry/_style-system/types";

import { useVariant, VariantsProvider } from "./variants-provider";

export const createDynamicComponent = <Props extends {}>(
  componentName: keyof Variants,
  slotName: string,
  DefaultComponent: React.FC<Props>,
  variants: Record<
    string,
    React.LazyExoticComponent<React.ComponentType<Props>>
  >,
  disableSkeleton?: boolean,
): React.FC<Props> => {
  const Component = (props: Props) => {
    const variantName = useVariant(componentName);
    const disableSuspense = useDisableSuspense();

    // If the variant is not defined, we are not in a preview
    if (!variantName) {
      return <DefaultComponent {...props} />;
    }

    const LazyComponent = variants[variantName];

    // If LazyComponent is not defined, its because it is the default variant
    if (!LazyComponent) {
      if (disableSuspense) {
        return <DefaultComponent {...props} />;
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
              // @ts-expect-error: we assume that the component has a className prop
              <Skeleton show={!disableSkeleton} className={props?.className}>
                <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
                  <DefaultComponent {...props} />
                </VariantsProvider>
              </Skeleton>
            }
          >
            <DisableSuspense>
              <DefaultComponent {...props} />
            </DisableSuspense>
          </React.Suspense>
        </ErrorBoundary>
      );
    }

    if (disableSuspense) {
      return <LazyComponent {...props} />;
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
            // @ts-expect-error: we assume that the component has a className prop
            <Skeleton className={props?.className}>
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

export const DisableSuspense = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <DisableSuspenseContext value>{children}</DisableSuspenseContext>;
};

const useDisableSuspense = () => {
  return React.useContext(DisableSuspenseContext);
};

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
};

function Skeleton({ className, show = true, ...props }: SkeletonProps) {
  if (!show) return props.children;
  return (
    <div
      className={cn(
        "bg-muted relative block h-6 animate-pulse rounded-md",
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
      <div className="border-border-danger bg-danger-muted text-fg-danger flex items-start gap-2 rounded-md p-2 text-sm">
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
