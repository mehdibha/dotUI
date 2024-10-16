"use client";

import * as React from "react";
import {
  Switch as AriaSwitch,
  composeRenderProps,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";

const switchStyles = tv({
  slots: {
    root: "group/switch disabled:text-fg-disabled flex items-center gap-3",
    wrapper: [
      focusRing(),
      "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "group-disabled/switch:border-border-disabled group-disabled/switch:group-selected/switch:border-none group-disabled/switch:group-selected/switch:bg-bg-disabled group-selected/switch:bg-border-focus bg-bg-neutral group-disabled/switch:cursor-not-allowed group-disabled/switch:border group-disabled/switch:bg-transparent",
    ],
    indicator:
      "group-disabled/switch:bg-fg-disabled pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200",
    label: "",
  },
  variants: {
    size: {
      sm: {
        wrapper: "h-5 w-9",
        indicator:
          "group-pressed/switch:w-5 group-selected/switch:ml-4 group-selected/switch:group-pressed/switch:ml-3 size-4",
      },
      md: {
        wrapper: "h-6 w-11",
        indicator:
          "group-pressed/switch:w-6 group-selected/switch:ml-5 group-selected/switch:group-pressed/switch:ml-4 size-5",
      },
      lg: {
        wrapper: "h-7 w-12",
        indicator:
          "group-pressed/switch:w-7 group-selected/switch:ml-6 group-selected/switch:group-pressed/switch:ml-5 size-6",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SwitchProps
  extends Omit<AriaSwitchProps, "className">,
    VariantProps<typeof switchStyles> {
  className?: string;
}
const Switch = ({ className, size, ...props }: SwitchProps) => {
  const { root, wrapper, indicator, label } = switchStyles({ size });

  return (
    <AriaSwitch className={root({ className })} {...props}>
      {composeRenderProps(props.children, (children) => (
        <>
          <span className={wrapper({ className })}>
            <span className={indicator({})} style={{ contain: "layout" }} />
          </span>
          {children && <span className={label({})}>{children}</span>}
        </>
      ))}
    </AriaSwitch>
  );
};

export { Switch };
