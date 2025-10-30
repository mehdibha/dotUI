"use client";

import type * as React from "react";
import {
  ProgressBar as AriaProgress,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { createScopedContext } from "@dotui/registry/lib/utils";

const progressStyles = tv({
  slots: {
    root: "flex w-60 flex-col gap-2",
    indicator: "relative h-2.5 w-full overflow-hidden rounded-full",
    filler: [
      "h-full w-full min-w-14 flex-1 origin-left bg-fg transition-transform",
      "indeterminate:animate-progress-indeterminate indeterminate:mask-[linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:mask-size-[200%] indeterminate:[-webkit-mask-image:linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:[-webkit-mask-size:200%]",
    ],
    valueLabel: "text-sm",
  },
  variants: {
    variant: {
      primary: {
        indicator: "bg-muted",
        filler: "bg-primary",
      },
      accent: {
        indicator: "bg-accent-muted",
        filler: "bg-accent",
      },
      warning: {
        indicator: "bg-warning-muted",
        filler: "bg-warning",
      },
      danger: {
        indicator: "bg-danger-muted",
        filler: "bg-danger",
      },
      success: {
        indicator: "bg-success-muted",
        filler: "bg-success",
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
    valueText?: string;
    percentage?: number;
  }
>("ProgressRoot");

interface ProgressBarProps extends React.ComponentProps<typeof AriaProgress> {}

const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
  return (
    <AriaProgress
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { isIndeterminate, valueText, percentage }) => (
          <ProgressBarProvider
            isIndeterminate={isIndeterminate}
            valueText={valueText}
            percentage={percentage}
          >
            {children ?? <ProgressBarControl />}
          </ProgressBarProvider>
        ),
      )}
    </AriaProgress>
  );
};

interface ProgressBarControlProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof progressStyles> {
  duration?: `${number}s` | `${number}ms`;
}

const ProgressBarControl = ({
  className,
  variant,
  size,
  duration,
  ...props
}: ProgressBarControlProps) => {
  const { isIndeterminate, percentage } =
    useProgressBarContext("ProgressBarControl");

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

export { ProgressBar, ProgressBarControl, ProgressBarValueLabel };

export type {
  ProgressBarProps,
  ProgressBarControlProps,
  ProgressBarValueLabelProps,
};
