"use client";

import * as React from "react";
import {
  Switch as AriaSwitch,
  composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing, focusRingGroup } from "@/registry/lib/focus-styles";
import { createScopedContext } from "@/registry/lib/utils";

const switchStyles = tv({
  slots: {
    root: "disabled:text-fg-disabled group flex items-center justify-start gap-3",
    indicator: [
      "group-disabled:border-border-disabled group-selected:group-disabled:border-none group-selected:group-disabled:bg-bg-disabled group-selected:bg-border-focus bg-bg-neutral inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors group-disabled:cursor-not-allowed group-disabled:border group-disabled:bg-transparent",
    ],
    thumb:
      "group-disabled:bg-fg-disabled pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200",
  },
  variants: {
    variant: {
      default: { indicator: focusRingGroup() },
      card: {
        root: [
          focusRing(),
          "selected:bg-bg-muted disabled:selected:bg-bg-disabled disabled:border-border-disabled cursor-pointer flex-row-reverse justify-between gap-4 rounded-md border p-4 transition-colors",
        ],
      },
    },
    size: {
      sm: {
        indicator: "h-5 w-9",
        thumb:
          "group-pressed:w-5 group-selected:ml-4 group-selected:group-pressed:ml-3 size-4",
      },
      md: {
        indicator: "h-6 w-11",
        thumb:
          "group-pressed:w-6 group-selected:ml-5 group-selected:group-pressed:ml-4 size-5",
      },
      lg: {
        indicator: "w-13 h-7",
        thumb:
          "group-pressed:w-7 group-selected:ml-6 group-selected:group-pressed:ml-5 size-6",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const { root, indicator, thumb } = switchStyles();

const [SwitchProvider, useSwitchContext] =
  createScopedContext<VariantProps<typeof switchStyles>>("SwitchRoot");

interface SwitchProps extends SwitchRootProps {}
const Switch = ({ children, ...props }: SwitchProps) => {
  return (
    <SwitchRoot {...props}>
      {composeRenderProps(children, (children) => (
        <>
          <SwitchIndicator>
            <SwitchThumb />
          </SwitchIndicator>
          {children}
        </>
      ))}
    </SwitchRoot>
  );
};

interface SwitchRootProps
  extends React.ComponentProps<typeof AriaSwitch>,
    VariantProps<typeof switchStyles> {}
const SwitchRoot = ({
  variant,
  size,
  className,
  ...props
}: SwitchRootProps) => {
  return (
    <SwitchProvider variant={variant} size={size}>
      <AriaSwitch
        className={composeRenderProps(className, (className) =>
          root({ variant, size, className })
        )}
        {...props}
      />
    </SwitchProvider>
  );
};

interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}
const SwitchIndicator = ({ className, ...props }: SwitchIndicatorProps) => {
  const { variant, size } = useSwitchContext("SwitchIndicator");
  return (
    <span className={indicator({ variant, size, className })} {...props} />
  );
};

interface SwitchThumbProps extends React.ComponentProps<"span"> {}
const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
  const { variant, size } = useSwitchContext("SwitchThumb");
  return <span className={thumb({ variant, size, className })} {...props} />;
};

export type {
  SwitchProps,
  SwitchRootProps,
  SwitchIndicatorProps,
  SwitchThumbProps,
};
export { Switch, SwitchRoot, SwitchIndicator, SwitchThumb };
