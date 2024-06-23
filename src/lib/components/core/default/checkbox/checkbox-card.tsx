"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const checkboxCardStyles = tv({
  slots: {
    root: [
      focusRing(),
      "border rounded-md p-4 cursor-pointer flex flex-row items-center justify-between gap-4 selected:bg-bg-muted indeterminate:bg-bg-muted disabled:text-fg-disabled disabled:cursor-not-allowed transition-colors",
    ],
    indicator: [
      "flex items-center justify-center size-4 shrink-0 rounded-sm border cursor-pointer",
      "bg-transparent text-transparent selected:bg-bg-primary selected:text-fg-onPrimary transition-colors duration-75 selected:border:border-bg-primary",
      "indeterminate:bg-bg-primary indeterminate:text-fg-onPrimary",
      "disabled:selected:text-fg-disabled disabled:cursor-not-allowed disabled:border-border-disabled disabled:selected:bg-bg-disabled disabled:indeterminate:bg-bg-disabled",
    ],
    wrapper: "flex flex-col space-y-1 mr-4 text-sm",
    title: "font-semibold",
    description: "text-fg-muted disabled:text-fg-disabled",
  },
});

interface CheckboxCardProps
  extends Omit<AriaCheckboxProps, "className" | "children">,
    VariantProps<typeof checkboxCardStyles> {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}
const CheckboxCard = React.forwardRef<React.ElementRef<typeof AriaCheckbox>, CheckboxCardProps>(
  ({ className, children, title, description, ...props }, ref) => {
    const {
      root,
      indicator,
      wrapper,
      title: titleStyle,
      description: descriptionStyle,
    } = checkboxCardStyles({});
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
            {children ?? (
              <div className={wrapper({})}>
                <span className={titleStyle({})}>{title}</span>
                {description && (
                  <span
                    data-rac=""
                    data-disabled={isDisabled || undefined}
                    className={descriptionStyle({})}
                  >
                    {description}
                  </span>
                )}
              </div>
            )}
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
              data-required={props.isRequired || undefined}
              className={indicator({ className: "" })}
            >
              {isIndeterminate ? (
                <MinusIcon strokeWidth={3} className="size-2.5" />
              ) : (
                <CheckIcon className="size-3" />
              )}
            </div>
          </>
        )}
      </AriaCheckbox>
    );
  }
);
CheckboxCard.displayName = "CheckboxCard";

export { CheckboxCard };
