"use client";

import * as React from "react";
import {
  Switch as AriaSwitch,
  composeRenderProps,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const switchStyles = tv({
  slots: {
    root: "flex items-center gap-3 disabled:text-fg-disabled",
    wrapper: [
      focusRing(),
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "disabled:cursor-not-allowed disabled:bg-transparent disabled:border disabled:border-border-disabled disabled:selected:border-none disabled:selected:bg-bg-disabled selected:bg-border-focus bg-bg-muted",
    ],
    indicator:
      "pointer-events-none block rounded-full bg-white selected:bg-fg-onAccent shadow-lg ring-0 transition-all translate-x-0 disabled:bg-fg-disabled",
    label: "",
  },
  variants: {
    size: {
      sm: {
        wrapper: "h-5 w-9",
        indicator: "size-4 pressed:w-5 selected:ml-4 selected:pressed:ml-3",
      },
      md: {
        wrapper: "h-6 w-11",
        indicator: "size-5 pressed:w-6 selected:ml-5 selected:pressed:ml-4",
      },
      lg: {
        wrapper: "h-7 w-12",
        indicator: "size-6 pressed:w-7 selected:translate-x-5",
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
      {composeRenderProps(
        props.children,
        (
          children,
          { isSelected, isPressed, isHovered, isFocused, isFocusVisible, isDisabled, isReadOnly }
        ) => (
          <>
            <span
              data-rac=""
              data-selected={isSelected || undefined}
              data-pressed={isPressed || undefined}
              data-hovered={isHovered || undefined}
              data-focused={isFocused || undefined}
              data-focus-visible={isFocusVisible || undefined}
              data-disabled={isDisabled || undefined}
              data-readonly={isReadOnly || undefined}
              className={wrapper({ className })}
            >
              <span
                data-rac=""
                data-selected={isSelected || undefined}
                data-pressed={isPressed || undefined}
                data-hovered={isHovered || undefined}
                data-focused={isFocused || undefined}
                data-focus-visible={isFocusVisible || undefined}
                data-disabled={isDisabled || undefined}
                data-readonly={isReadOnly || undefined}
                className={indicator({})}
              />
            </span>
            {children && <span className={label({})}>{children}</span>}
          </>
        )
      )}
    </AriaSwitch>
  );
};

export { Switch };
