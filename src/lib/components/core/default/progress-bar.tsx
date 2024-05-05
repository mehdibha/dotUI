"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";

const progressBarVariants = tv({
  slots: {
    root: "relative h-2.5 w-full overflow-hidden rounded-full",
    indicator:
      "h-full animate-progress-grow w-full flex-1 bg-fg transition-transform origin-left",
  },
  variants: {
    variant: {
      default: {
        root: "bg-bg-muted",
        indicator: "bg-bg-primary",
      },
      info: {
        root: "bg-bg-info-muted",
        indicator: "bg-bg-info",
      },
      warning: {
        root: "bg-bg-warning-muted",
        indicator: "bg-bg-warning",
      },
      danger: {
        root: "bg-bg-danger-muted",
        indicator: "bg-bg-danger",
      },
      success: {
        root: "bg-bg-success-muted",
        indicator: "bg-bg-success",
      },
    },
    size: {
      sm: {
        root: "h-1",
      },
      md: {
        root: "h-2.5",
      },
      lg: {
        root: "h-4",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ProgressBarProps = Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  "value"
> &
  VariantProps<typeof progressBarVariants> & {
    min?: number;
    max?: number;
    label?: string;
    duration?: string;
    indicatorProps?: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>;
  } & (
    | { value?: number | null | undefined; duration?: never }
    | { value?: never; duration?: string }
  );

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(
  (
    {
      className,
      value,
      variant,
      size,
      min = 0,
      max = 100,
      duration,
      indicatorProps,
      ...props
    },
    ref
  ) => {
    const { root, indicator } = progressBarVariants({ variant, size });
    const normalise = (value: number) => ((value - min) * 100) / (max - min);
    const indeterminate = !value && !duration;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(root(), duration && "animate-progress-grow", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          {...indicatorProps}
          className={cn(
            indicator(),
            indeterminate && "animate-progress-indeterminate",
            indicatorProps?.className
          )}
          style={
            {
              ...indicatorProps?.style,
              transform: `scaleX(${(value ? normalise(value) : 100) / 100})`,
              ...(duration ? { "--progress-duration": duration } : {}),
              ...(indeterminate
                ? {
                    maskImage:
                      "linear-gradient(75deg, rgb(0, 0, 0) 30%, rgba(0, 0, 0, 0.65) 80%)",
                    maskSize: "200%",
                  }
                : {}),
            } as React.CSSProperties
          }
        />
      </ProgressPrimitive.Root>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
