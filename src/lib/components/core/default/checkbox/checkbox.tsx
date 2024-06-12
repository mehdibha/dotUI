"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const checkboxStyles = tv({
  slots: {
    root: "flex flex-row items-center invalid:text-fg-danger disabled:text-fg-disabled",
    indicator: [
      focusRing(),
      "flex items-center justify-center size-4 shrink-0 rounded-sm border border-border-control cursor-pointer",
      "bg-transparent text-transparent selected:bg-bg-primary selected:text-fg-onPrimary transition-colors duration-75 selected:border:border-bg-primary",
      "indeterminate:bg-bg-primary indeterminate:text-fg-onPrimary",
      "read-only:cursor-default",
      "disabled:cursor-not-allowed disabled:border-border-disabled disabled:selected:text-fg-disabled disabled:selected:bg-bg-disabled disabled:indeterminate:bg-bg-disabled",
      "invalid:border-border-danger invalid:selected:bg-bg-danger-muted invalid:selected:text-fg-onMutedDanger"
    ],
    label: "ml-2",
  },
});

interface CheckboxProps
  extends Omit<AriaCheckboxProps, "className" | "children">,
    VariantProps<typeof checkboxStyles> {
  children?: React.ReactNode;
  className?: string;
}
const Checkbox = React.forwardRef<React.ElementRef<typeof AriaCheckbox>, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    const { root, indicator, label } = checkboxStyles({});
    return (
      <AriaCheckbox ref={ref} {...props} className={root({ className })}>
        {({
          isIndeterminate,
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
              data-indeterminate={props.isIndeterminate || undefined}
              data-pressed={isPressed || undefined}
              data-hovered={isHovered || undefined}
              data-focused={isFocused || undefined}
              data-focus-visible={isFocusVisible || undefined}
              data-disabled={isDisabled || undefined}
              data-readonly={isReadOnly || undefined}
              data-invalid={isInvalid || undefined}
              className={indicator({ className: "" })}
            >
              {isIndeterminate ? (
                <MinusIcon strokeWidth={3} className="size-2.5" />
              ) : (
                <CheckIcon className="size-3" />
              )}
            </div>
            {children && <span className={label({})}>{children}</span>}
          </>
        )}
      </AriaCheckbox>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
