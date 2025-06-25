"use client";

import * as React from "react";
import {
  Switch as AriaSwitch,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { focusRing, focusRingGroup } from "@dotui/ui/lib/focus-styles";

import { createScopedContext } from "@/lib/utils";

const switchStyles = tv({
  slots: {
    root: "group flex items-center justify-start gap-3 disabled:text-fg-disabled",
    indicator: [
      "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-bg-neutral transition-colors group-disabled:cursor-not-allowed group-disabled:border group-disabled:border-border-disabled group-disabled:bg-transparent group-selected:bg-border-focus group-selected:group-disabled:border-none group-selected:group-disabled:bg-bg-disabled",
    ],
    thumb:
      "pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200 group-disabled:bg-fg-disabled",
  },
  variants: {
    variant: {
      default: { indicator: focusRingGroup() },
      card: {
        root: [
          focusRing(),
          "cursor-pointer flex-row-reverse justify-between gap-4 rounded-md border p-4 transition-colors disabled:border-border-disabled selected:bg-bg-muted disabled:selected:bg-bg-disabled",
        ],
      },
    },
    size: {
      sm: {
        indicator: "h-5 w-9",
        thumb:
          "size-4 group-pressed:w-5 group-selected:ml-4 group-selected:group-pressed:ml-3",
      },
      md: {
        indicator: "h-6 w-11",
        thumb:
          "size-5 group-pressed:w-6 group-selected:ml-5 group-selected:group-pressed:ml-4",
      },
      lg: {
        indicator: "h-7 w-13",
        thumb:
          "size-6 group-pressed:w-7 group-selected:ml-6 group-selected:group-pressed:ml-5",
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
          root({ variant, size, className }),
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
