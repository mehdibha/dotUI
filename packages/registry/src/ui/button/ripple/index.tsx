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

import { useRipple } from "@dotui/registry/hooks/use-ripple";
import { focusRing } from "@dotui/registry/lib/focus-styles";
import { createOptionalScopedContext } from "@dotui/registry/lib/utils";
import { Ripple } from "@dotui/registry/ui/button/ripple/ripple";
import { Loader } from "@dotui/registry/ui/loader";

const buttonStyles = tv({
  extend: focusRing,
  base: "disabled:bg-disabled disabled:text-fg-disabled pending:cursor-default pending:border pending:border-border-disabled pending:bg-disabled pending:text-fg-disabled relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-medium leading-normal transition-colors disabled:cursor-default",
  variants: {
    variant: {
      default:
        "bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover border",
      primary: "bg-primary text-fg-on-primary hover:bg-primary-hover",
      quiet: "text-fg hover:bg-inverse/10 bg-transparent",
      link: "text-fg underline-offset-4 hover:underline",
      success: "bg-success text-fg-on-success hover:bg-success-hover",
      warning: "bg-warning text-fg-on-warning hover:bg-warning-hover",
      danger: "bg-danger text-fg-on-danger hover:bg-danger-hover",
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

type ButtonProps = Omit<AriaButtonProps, "className"> &
  Omit<AriaLinkProps, "className" | "children" | "style" | "onAnimationEnd"> &
  VariantProps<typeof buttonStyles> & {
    className?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
  };

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
