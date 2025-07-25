"use client";

import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { focusRing } from "@/registry/lib/focus-styles";
import { createOptionalScopedContext } from "@/registry/lib/utils";
import {
  ToggleButton as AriaToggleButton,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const toggleButtonStyles = tv({
  extend: focusRing,
  base: "disabled:bg-bg-disabled disabled:text-fg-disabled inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium transition-colors disabled:cursor-default",
  variants: {
    variant: {
      quiet:
        "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg selected:bg-bg-primary selected:text-fg-onPrimary selected:hover:bg-bg-primary-hover selected:pressed:bg-bg-primary-active bg-transparent",
      primary:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 pressed:border-transparent text-fg selected:bg-bg-primary selected:border-transparent selected:text-fg-onPrimary selected:hover:bg-bg-primary-hover selected:pressed:bg-bg-primary-active border bg-transparent",
      accent:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 pressed:border-transparent text-fg selected:bg-bg-accent selected:border-transparent selected:hover:bg-bg-accent-hover selected:pressed:bg-bg-accent-active selected:text-fg-onAccent border bg-transparent",
    },
    size: {
      sm: "size-8 [&_svg]:size-4",
      md: "size-9 [&_svg]:size-4",
      lg: "size-10 [&_svg]:size-5",
    },
    shape: {
      rectangle: "",
      square: "",
      circle: "rounded-full",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      shape: "rectangle",
      className: "w-auto px-3",
    },
    {
      size: "md",
      shape: "rectangle",
      className: "w-auto px-4",
    },
    {
      size: "lg",
      shape: "rectangle",
      className: "w-auto px-5",
    },
  ],
  defaultVariants: {
    variant: "quiet",
    size: "md",
    shape: "square",
  },
});

const [ToggleButtonProvider, useToggleButtonContext] =
  createOptionalScopedContext<VariantProps<typeof toggleButtonStyles>>(
    "Button",
  );

interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, "className">,
    VariantProps<typeof toggleButtonStyles> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const ToggleButton = React.forwardRef(
  (
    localProps: ToggleButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const contextProps = useToggleButtonContext();
    const props = { ...contextProps, ...localProps };
    const { className, variant, size, shape, prefix, suffix, ...restProps } =
      props;
    return (
      <AriaToggleButton
        ref={ref}
        {...restProps}
        className={toggleButtonStyles({
          variant,
          size,
          shape,
          className,
        })}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {prefix}
            {typeof children === "string" ? (
              <span className="truncate">{children}</span>
            ) : (
              children
            )}
            {suffix}
          </>
        ))}
      </AriaToggleButton>
    );
  },
);
ToggleButton.displayName = "ToggleButton";

export type { ToggleButtonProps };
export { ToggleButton, toggleButtonStyles, ToggleButtonProvider };
