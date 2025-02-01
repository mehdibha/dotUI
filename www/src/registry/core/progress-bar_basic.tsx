"use client";

import * as React from "react";
import {
  ProgressBar as AriaProgress,
  composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Label } from "@/registry/core/field_basic";
import { createScopedContext } from "@/registry/lib/context-helpers";

const progressStyles = tv({
  slots: {
    root: "flex w-60 flex-col gap-2",
    indicator: "relative h-2.5 w-full overflow-hidden rounded-full",
    filler: [
      "bg-fg h-full w-full min-w-14 flex-1 origin-left transition-transform",
      "indeterminate:animate-progress-indeterminate indeterminate:[-webkit-mask-image:linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:[-webkit-mask-size:200%] indeterminate:[mask-image:linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:[mask-size:200%]",
    ],
    valueLabel: "text-sm",
  },
  variants: {
    variant: {
      primary: {
        indicator: "bg-bg-muted",
        filler: "bg-bg-primary",
      },
      accent: {
        indicator: "bg-bg-accent-muted",
        filler: "bg-bg-accent",
      },
      warning: {
        indicator: "bg-bg-warning-muted",
        filler: "bg-bg-warning",
      },
      danger: {
        indicator: "bg-bg-danger-muted",
        filler: "bg-bg-danger",
      },
      success: {
        indicator: "bg-bg-success-muted",
        filler: "bg-bg-success",
      },
    },
    size: {
      sm: {
        indicator: "h-1",
      },
      md: {
        indicator: "h-2.5",
      },
      lg: {
        indicator: "h-4",
      },
    },
  },
  defaultVariants: {
    variant: "accent",
    size: "md",
  },
});

const { root, indicator, filler, valueLabel } = progressStyles();

const [ProgressBarProvider, useProgressBarContext] = createScopedContext<
  VariantProps<typeof progressStyles> & {
    isIndeterminate: boolean;
    duration: `${number}s` | `${number}ms`;
    valueText?: string;
    percentage?: number;
  }
>("ProgressRoot");

interface ProgressBarProps extends ProgressBarRootProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  showValueLabel?: boolean;
}
const ProgressBar = ({
  label,
  description,
  showValueLabel = false,
  ...props
}: ProgressBarProps) => {
  return (
    <ProgressBarRoot {...props}>
      <div className="grid grid-cols-[1fr_auto] [grid-template-areas:'label_value']">
        {label && <Label className="[grid-area:label]">{label}</Label>}
        {showValueLabel && (
          <ProgressBarValueLabel className="[grid-area:value]" />
        )}
      </div>
      <ProgressBarIndicator />
    </ProgressBarRoot>
  );
};

interface ProgressBarRootProps
  extends React.ComponentProps<typeof AriaProgress>,
    VariantProps<typeof progressStyles> {
  duration?: `${number}s` | `${number}ms`;
}
const ProgressBarRoot = ({
  variant,
  size,
  duration = "0s",
  isIndeterminate,
  children,
  className,
  ...props
}: ProgressBarRootProps) => {
  return (
    <AriaProgress
      className={composeRenderProps(className, (className) =>
        root({ variant, className })
      )}
      isIndeterminate={
        isIndeterminate || (duration !== "0s" && duration !== "0ms")
      }
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { isIndeterminate, valueText, percentage }) => (
          <ProgressBarProvider
            duration={duration}
            variant={variant}
            size={size}
            isIndeterminate={isIndeterminate}
            valueText={valueText}
            percentage={percentage}
          >
            {children}
          </ProgressBarProvider>
        )
      )}
    </AriaProgress>
  );
};

interface ProgressBarIndicatorProps extends React.ComponentProps<"div"> {}
const ProgressBarIndicator = ({
  className,
  ...props
}: ProgressBarIndicatorProps) => {
  const { variant, size, isIndeterminate, percentage, duration } =
    useProgressBarContext("ProgressBarIndicator");
  return (
    <div className={indicator({ variant, size, className })} {...props}>
      <div
        data-rac=""
        data-indeterminate={isIndeterminate || undefined}
        className={filler({ variant, size })}
        style={
          {
            "--progress-duration": duration,
            transform: percentage ? `scaleX(${percentage / 100})` : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  );
};

interface ProgressBarValueLabelProps extends React.ComponentProps<"span"> {}
const ProgressBarValueLabel = ({
  className,
  ...props
}: ProgressBarValueLabelProps) => {
  const { valueText } = useProgressBarContext("ProgressBarValueLabel");

  return (
    <span className={valueLabel({ className })} {...props}>
      {valueText}
    </span>
  );
};

export type {
  ProgressBarProps,
  ProgressBarRootProps,
  ProgressBarIndicatorProps,
  ProgressBarValueLabelProps,
};

export {
  ProgressBar,
  ProgressBarRoot,
  ProgressBarIndicator,
  ProgressBarValueLabel,
};
