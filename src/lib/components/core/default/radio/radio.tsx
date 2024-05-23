"use client";

import * as React from "react";
import {
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const radioStyles = tv({
  slots: {
    root: "flex flex-row items-center disabled:text-fg-disabled",
    indicator: [
      "mr-2",
      "relative size-4 shrink-0 rounded-full border cursor-pointer selected:border-bg-primary selected:border-4 transition-all duration-100",
      "disabled:cursor-not-allowed disabled:border-border-disabled disabled:selected:bg-bg-disabled disabled:indeterminate:bg-bg-disabled",
    ],
    label: "",
  },
});

interface RadioProps
  extends Omit<AriaRadioProps, "className" | "children">,
    VariantProps<typeof radioStyles> {
  children?: React.ReactNode;
  className?: string;
}
const Radio = React.forwardRef<React.ElementRef<typeof AriaRadio>, RadioProps>(
  ({ className, children, ...props }, ref) => {
    const { root, indicator, label } = radioStyles({});
    return (
      <AriaRadio ref={ref} {...props} className={root({ className })}>
        {({
          isSelected,
          isPressed,
          isHovered,
          isFocused,
          isFocusVisible,
          isDisabled,
          isReadOnly,
          isInvalid,
        }) => (
          <>
            <div
              data-rac=""
              data-selected={isSelected || undefined}
              data-pressed={isPressed || undefined}
              data-hovered={isHovered || undefined}
              data-focused={isFocused || undefined}
              data-focus-visible={isFocusVisible || undefined}
              data-disabled={isDisabled || undefined}
              data-readonly={isReadOnly || undefined}
              data-invalid={isInvalid || undefined}
              // data-required={props.isRequired || undefined}
              className={indicator({ className: "" })}
            />
            {children && <span className={label({})}>{children}</span>}
          </>
        )}
      </AriaRadio>
    );
  }
);
Radio.displayName = "Radio";

export { Radio };
