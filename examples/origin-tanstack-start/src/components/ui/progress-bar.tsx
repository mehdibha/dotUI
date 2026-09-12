"use client";

import { type ComponentProps, createContext, use } from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ProgressBarPrimitive from "react-aria-components/ProgressBar";
import { tv, type VariantProps } from "tailwind-variants";

const progressBarVariants = tv({
  slots: {
    root: "flex invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden w-full flex-col gap-2",
    track:
      "relative flex w-full items-center overflow-x-hidden rounded-full h-1 bg-muted",
    fill: "h-full w-full bg-primary transition-all data-indeterminate:w-2/5 data-indeterminate:animate-progress-slide",
    output: "ml-auto text-fg-muted tabular-nums text-sm",
  },
  variants: {},
  defaultVariants: {},
});
const { root, track, fill, output } = progressBarVariants();

const ProgressBarContext =
  createContext<ProgressBarPrimitive.ProgressBarRenderProps | null>(null);
const useProgressBarContext = (componentName: string) => {
  const context = use(ProgressBarContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a ProgressBar`);
  }
  return context;
};

/* -------------------------------------------------------------------------- */

interface ProgressBarProps extends ComponentProps<
  typeof ProgressBarPrimitive.ProgressBar
> {}
const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
  return (
    <ProgressBarPrimitive.ProgressBar
      data-field=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, state) => (
        <ProgressBarContext value={state}>
          {children ?? <ProgressBarTrack />}
        </ProgressBarContext>
      ))}
    </ProgressBarPrimitive.ProgressBar>
  );
};

/* -------------------------------------------------------------------------- */

interface ProgressBarTrackProps extends React.ComponentProps<"div"> {}
type ProgressBarControlProps = ProgressBarTrackProps;

const ProgressBarTrack = ({
  children,
  className,
  ...props
}: ProgressBarTrackProps) => {
  return (
    <div className={track({ className })} {...props}>
      {children ?? <ProgressBarFill />}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

interface ProgressBarFillProps extends React.ComponentProps<"div"> {}
const ProgressBarFill = ({
  className,
  style,
  ...props
}: ProgressBarFillProps) => {
  const { isIndeterminate, percentage } =
    useProgressBarContext("ProgressBarControl");

  return (
    <div
      data-rac=""
      data-indeterminate={isIndeterminate || undefined}
      className={fill({ className })}
      style={{
        width: typeof percentage === "number" ? `${percentage}%` : undefined,
        ...style,
      }}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ProgressBarOutputProps extends React.ComponentProps<"span"> {}
const ProgressBarOutput = ({ className, ...props }: ProgressBarOutputProps) => {
  const { valueText } = useProgressBarContext("ProgressBarOutput");

  return (
    <span className={output({ className })} {...props}>
      {valueText}
    </span>
  );
};

/* -------------------------------------------------------------------------- */

const ProgressBarControl = ProgressBarTrack;

/* -------------------------------------------------------------------------- */

export type {
  ProgressBarControlProps,
  ProgressBarFillProps,
  ProgressBarOutputProps,
  ProgressBarProps,
};
export {
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarTrack,
};
