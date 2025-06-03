"use client";

import type {
  ButtonProps as AriaButtonProps,
  LinkProps as AriaLinkProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { Loader } from "@/components/dynamic-ui/loader";
import { Ripple } from "@/components/dynamic-ui/ripple";
import { useRipple } from "@/registry/hooks/use-ripple";
import { focusRing } from "@/registry/lib/focus-styles";
import { createOptionalScopedContext } from "@/registry/lib/utils";
import { chain } from "@react-aria/utils";
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
  PressEvent,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const buttonStyles = tv({
  extend: focusRing,
  base: "disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:bg-bg-disabled pending:text-fg-disabled pending:border pending:border-border-disabled relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-colors disabled:cursor-default",
  variants: {
    variant: {
      default: "bg-bg-neutral hover:bg-bg-neutral-hover text-fg-onNeutral",
      primary: "bg-bg-primary hover:bg-bg-primary-hover text-fg-onPrimary",
      quiet: "hover:bg-bg-inverse/10 text-fg bg-transparent",
      outline:
        "border-border-field hover:bg-bg-inverse/10 text-fg disabled:border-border-disabled border disabled:bg-transparent",
      accent: "bg-bg-accent hover:bg-bg-accent-hover text-fg-onAccent",
      success: "bg-bg-success hover:bg-bg-success-hover text-fg-onSuccess",
      warning: "bg-bg-warning hover:bg-bg-warning-hover text-fg-onWarning",
      danger: "bg-bg-danger hover:bg-bg-danger-hover text-fg-onDanger",
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
