"use client";

import * as React from "react";
import { Radio as AriaRadio, type RadioProps as AriaRadioProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const radioCardStyles = tv({
  slots: {
    root: [
      focusRing(),
      "border rounded-md p-4 cursor-pointer flex flex-row items-center justify-between gap-4 selected:bg-bg-muted disabled:text-fg-disabled transition-colors",
      "invalid:text-fg-danger selected:invalid:bg-bg-danger-muted invalid:border-border-danger",
    ],
    indicator: [
      "mr-2",
      "relative size-4 shrink-0 rounded-full border cursor-pointer selected:border-bg-primary selected:border-4 transition-all duration-100",
      "disabled:cursor-not-allowed disabled:border-border-disabled disabled:selected:bg-bg-disabled disabled:indeterminate:bg-bg-disabled",
      "invalid:border-border-danger invalid:selected:border-bg-danger",
    ],
    wrapper: "flex flex-col space-y-1 mr-4 text-sm",
    title: "font-semibold",
    description: "text-fg-muted disabled:text-fg- invalid:text-fg-danger",
  },
});

interface RadioProps
  extends Omit<AriaRadioProps, "className" | "children">,
    VariantProps<typeof radioCardStyles> {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}
const RadioCard = React.forwardRef<React.ElementRef<typeof AriaRadio>, RadioProps>(
  ({ className, children, title, description, ...props }, ref) => {
    const {
      root,
      indicator,
      wrapper,
      title: titleStyle,
      description: descriptionStyle,
    } = radioCardStyles({});
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
            {children ?? (
              <div className={wrapper({})}>
                <span className={titleStyle({})}>{title}</span>
                {description && (
                  <span
                    data-rac=""
                    data-disabled={isDisabled || undefined}
                    data-invalid={isInvalid || undefined}
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
              data-pressed={isPressed || undefined}
              data-hovered={isHovered || undefined}
              data-focused={isFocused || undefined}
              data-focus-visible={isFocusVisible || undefined}
              data-disabled={isDisabled || undefined}
              data-readonly={isReadOnly || undefined}
              data-invalid={isInvalid || undefined}
              className={indicator({ className: "" })}
            />
          </>
        )}
      </AriaRadio>
    );
  }
);
RadioCard.displayName = "RadioCard";

export { RadioCard, radioCardStyles };
