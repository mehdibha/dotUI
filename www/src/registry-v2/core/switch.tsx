"use client";

import * as React from "react";
import {
  Switch as AriaSwitch,
  composeRenderProps,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRingGroup } from "@/registry-v2/lib/focus-styles";

const switchStyles = tv({
  slots: {
    root: "disabled:text-fg-disabled group flex items-center justify-start gap-3",
    wrapper: [
      focusRingGroup(),
      "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "group-disabled:border-border-disabled group-selected:group-disabled:border-none group-selected:group-disabled:bg-bg-disabled group-selected:bg-border-focus bg-bg-neutral group-disabled:cursor-not-allowed group-disabled:border group-disabled:bg-transparent",
    ],
    indicator:
      "group-disabled:bg-fg-disabled pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200",
    label: "",
  },
  variants: {
    size: {
      sm: {
        wrapper: "h-5 w-9",
        indicator:
          "group-pressed:w-5 group-selected:ml-4 group-selected:group-pressed:ml-3 size-4",
      },
      md: {
        wrapper: "h-6 w-11",
        indicator:
          "group-pressed:w-6 group-selected:ml-5 group-selected:group-pressed:ml-4 size-5",
      },
      lg: {
        wrapper: "h-7 w-12",
        indicator:
          "group-pressed:w-7 group-selected:ml-6 group-selected:group-pressed:ml-5 size-6",
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

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  ({ className, size, ...props }, ref) => {
    const { root, wrapper, indicator, label } = switchStyles({ size });

    return (
      <AriaSwitch className={root({ className })} {...props} ref={ref}>
        {composeRenderProps(props.children, (children) => (
          <>
            <span className={wrapper({})}>
              <span className={indicator({})} style={{ contain: "layout" }} />
            </span>
            {children && <span className={label({})}>{children}</span>}
          </>
        ))}
      </AriaSwitch>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
