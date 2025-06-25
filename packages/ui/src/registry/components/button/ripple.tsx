"use client";

import * as React from "react";
import { chain } from "@react-aria/utils";
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  ButtonProps as AriaButtonProps,
  LinkProps as AriaLinkProps,
  PressEvent,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Loader } from "@dotui/ui/components/loader";
import { Ripple } from "@dotui/ui/components/ripple";
import { useRipple } from "@dotui/ui/hooks/use-ripple";
import { focusRing } from "@dotui/ui/lib/focus-styles";

import { createOptionalScopedContext } from "@/lib/utils";

const buttonStyles = tv({
  extend: focusRing,
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-colors disabled:cursor-default disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:border pending:border-border-disabled pending:bg-bg-disabled pending:text-fg-disabled",
  variants: {
    variant: {
      default: "bg-bg-neutral text-fg-onNeutral hover:bg-bg-neutral-hover",
      primary: "bg-bg-primary text-fg-onPrimary hover:bg-bg-primary-hover",
      quiet: "bg-transparent text-fg hover:bg-bg-inverse/10",
      outline:
        "border border-border-field text-fg hover:bg-bg-inverse/10 disabled:border-border-disabled disabled:bg-transparent",
      accent: "bg-bg-accent text-fg-onAccent hover:bg-bg-accent-hover",
      success: "bg-bg-success text-fg-onSuccess hover:bg-bg-success-hover",
      warning: "bg-bg-warning text-fg-onWarning hover:bg-bg-warning-hover",
      danger: "bg-bg-danger text-fg-onDanger hover:bg-bg-danger-hover",
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
    variant: "default",
    size: "md",
    shape: "rectangle",
  },
});

const [ButtonProvider, useButtonContext] =
  createOptionalScopedContext<VariantProps<typeof buttonStyles>>("Button");

interface ButtonProps
  extends Omit<AriaButtonProps, "className">,
    Omit<AriaLinkProps, "className" | "children" | "style">,
    VariantProps<typeof buttonStyles> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = React.forwardRef(
  (localProps: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const contextProps = useButtonContext();
    const props = { ...contextProps, ...localProps };

    const { className, variant, size, shape, prefix, suffix, ...restProps } =
      props;

    const {
      onPress: onRipplePressHandler,
      onClear: onClearRipple,
      ripples,
    } = useRipple();

    const Element: React.ElementType = props.href ? AriaLink : AriaButton;

    const handlePress = React.useCallback(
      (e: PressEvent) => {
        // if (isDisabled) return;
        onRipplePressHandler(e);
        // domRef.current && onRipplePressHandler(e);
      },
      [onRipplePressHandler],
    );

    return (
      <Element
        ref={ref}
        {...restProps}
        className={buttonStyles({ variant, size, shape, className })}
        onPressStart={chain(props.onPress, handlePress)}
      >
        {composeRenderProps(props.children, (children, { isPending }) => (
          <>
            <Ripple ripples={ripples} onClear={onClearRipple} />
            {isPending && <Loader aria-label="loading" size={16} />}
            {prefix}
            {typeof children === "string" ? (
              <span className="truncate">{children}</span>
            ) : (
              children
            )}
            {suffix}
          </>
        ))}
      </Element>
    );
  },
);
Button.displayName = "Button";

export type { ButtonProps };
export { Button, buttonStyles, ButtonProvider };
