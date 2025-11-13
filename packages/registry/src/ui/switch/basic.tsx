"use client";

import type * as React from "react";
import {
  Switch as AriaSwitch,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { SwitchRenderProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { createContext } from "@dotui/registry/lib/context";

const switchStyles = tv({
  slots: {
    root: "group/switch flex items-center justify-start gap-3 disabled:text-fg-disabled has-data-[slot=description]:items-start",
    indicator: [
      "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutral transition-colors group-disabled:cursor-not-allowed group-disabled:border group-disabled:border-border-disabled group-disabled:bg-transparent group-selected:bg-border-focus group-selected:group-disabled:border-none group-selected:group-disabled:bg-disabled",
    ],
    thumb:
      "pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200 group-disabled:bg-fg-disabled",
  },
  variants: {
    variant: {
      default: {
        indicator: "focus-reset group-focus-visible/switch:focus-ring",
      },
    },
    size: {
      sm: {
        indicator: "h-5 w-9",
        thumb:
          "size-4 group-selected/switch:group-pressed/switch:ml-3 group-selected/switch:ml-4 group-pressed/switch:w-5",
      },
      md: {
        indicator: "h-6 w-11",
        thumb:
          "size-5 group-selected/switch:group-pressed/switch:ml-4 group-selected/switch:ml-5 group-pressed/switch:w-6",
      },
      lg: {
        indicator: "h-7 w-13",
        thumb:
          "size-6 group-selected/switch:group-pressed/switch:ml-5 group-selected/switch:ml-6 group-pressed/switch:w-7",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const { root, indicator, thumb } = switchStyles();

/* -----------------------------------------------------------------------------------------------*/

interface InternalSwitchContextValue
  extends SwitchRenderProps,
    VariantProps<typeof switchStyles> {}

const [InternalSwitchProvider, useInternalSwitch] =
  createContext<InternalSwitchContextValue>({
    strict: true,
  });

/* -----------------------------------------------------------------------------------------------*/

interface SwitchProps
  extends React.ComponentProps<typeof AriaSwitch>,
    VariantProps<typeof switchStyles> {}

const Switch = ({
  children,
  variant,
  size,
  className,
  ...props
}: SwitchProps) => {
  return (
    <AriaSwitch
      className={composeRenderProps(className, (className) =>
        root({ variant, size, className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => {
        return (
          <InternalSwitchProvider value={{ ...renderProps, variant, size }}>
            {children ? (
              children
            ) : (
              <SwitchIndicator>
                <SwitchThumb />
              </SwitchIndicator>
            )}
          </InternalSwitchProvider>
        );
      })}
    </AriaSwitch>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

const SwitchIndicator = ({ className, ...props }: SwitchIndicatorProps) => {
  const ctx = useInternalSwitch("SwitchIndicator");
  return (
    <span
      data-rac=""
      data-selected={ctx.isSelected || undefined}
      data-pressed={ctx.isPressed || undefined}
      data-hovered={ctx.isHovered || undefined}
      data-focused={ctx.isFocused || undefined}
      data-focus-visible={ctx.isFocusVisible || undefined}
      data-disabled={ctx.isDisabled || undefined}
      data-readonly={ctx.isReadOnly || undefined}
      className={indicator({ variant: ctx.variant, size: ctx.size, className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SwitchThumbProps extends React.ComponentProps<"span"> {}

const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
  const ctx = useInternalSwitch("SwitchThumb");
  return (
    <span
      className={thumb({ variant: ctx.variant, size: ctx.size, className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { SwitchProps, SwitchIndicatorProps, SwitchThumbProps };
export { Switch, SwitchIndicator, SwitchThumb };
