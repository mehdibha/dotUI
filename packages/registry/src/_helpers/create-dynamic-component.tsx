import React from "react";
import { AlertCircleIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { DEFAULT_VARIANTS_DEFINITION } from "@dotui/registry/_style-system/constants";
import { cn } from "@dotui/registry/lib/utils";
import type { Variants } from "@dotui/registry/_style-system/types";

import { useVariant, VariantsProvider } from "./variants-provider";

// Type helper to ensure all non-"basic" variants are included
type OmitBasic<T extends string> = T extends "basic" ? never : T;

// Utility to create a properly typed variants object
export type VariantsMap<Props, VariantKey extends string> = Record<
  OmitBasic<VariantKey>,
  React.LazyExoticComponent<React.ComponentType<Props>>
>;

/**
 * Helper to safely extract className from props
 * Returns undefined if className doesn't exist or isn't a string
 */
function getClassName(props: Record<string, unknown>): string | undefined {
  if ("className" in props && typeof props.className === "string") {
    return props.className;
  }
  return undefined;
}

export const createDynamicComponent = <
  Props extends Record<string, any> = Record<string, unknown>,
  VariantKey extends string = string,
>(
  componentName: keyof Variants,
  slotName: string,
  DefaultComponent: React.FC<Props>,
  variants: VariantsMap<Props, VariantKey>,
  disableSkeleton?: boolean,
): React.FC<Props> => {
  const Component = (props: Props) => {
    const rawVariantName = useVariant(componentName);
    const disableSuspense = useDisableSuspense();

    // If the variant is not defined, we are not in a preview
    if (!rawVariantName) {
      return <DefaultComponent {...props} />;
    }

    // After null check, variantName is guaranteed to be a string enum value
    // TypeScript infers complex union types from Variants, so we need to help it understand
    // that this is just a string value at runtime
    const variantName = rawVariantName as string;

    // Extract className safely without type assertions
    const className = getClassName(props);

    // Type-safe variant lookup - we need to cast to OmitBasic<VariantKey>
    // since the variants map excludes "basic"
    const variantKey = variantName as OmitBasic<VariantKey>;
    const LazyComponent = variants[variantKey];

    // If LazyComponent is not defined, its because it is the default variant
    if (!LazyComponent) {
      if (disableSuspense) {
        return <DefaultComponent {...props} />;
      }

      return (
        <ErrorBoundary
          fallback={
            <Error
              componentName={String(componentName)}
              slotName={slotName}
              variantName={variantName}
            />
          }
        >
          <React.Suspense
            fallback={
              <Skeleton show={!disableSkeleton} className={className}>
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

    // Render the lazy component
    // LazyExoticComponent<ComponentType<Props>> is compatible with ComponentType<Props>
    // but TypeScript needs explicit casting to understand the relationship
    const renderLazy = () => {
      const Component = LazyComponent as React.ComponentType<Props>;
      return <Component {...props} />;
    };

    if (disableSuspense) {
      return renderLazy();
    }

    return (
      <ErrorBoundary
        fallback={
          <Error
            componentName={String(componentName)}
            slotName={slotName}
            variantName={variantName}
          />
        }
      >
        <React.Suspense
          fallback={
            <Skeleton className={className}>
              <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
                <DefaultComponent {...props} />
              </VariantsProvider>
            </Skeleton>
          }
        >
          <DisableSuspense>{renderLazy()}</DisableSuspense>
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
