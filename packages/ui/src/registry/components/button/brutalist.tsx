"use client";

import * as React from "react";
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  ButtonProps as AriaButtonProps,
  LinkProps as AriaLinkProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Loader } from "@dotui/ui/components/loader";
import { focusRing } from "@dotui/ui/lib/focus-styles";
import { createOptionalScopedContext } from "@dotui/ui/lib/utils";

const buttonStyles = tv({
  extend: focusRing,
  base: [
    "disabled:bg-disabled disabled:text-fg-disabled pending:cursor-default pending:border pending:border-border-disabled pending:bg-disabled pending:text-fg-disabled inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium leading-normal transition-all disabled:cursor-default",
    "shadow-brutalism hover:translate-x-(--box-shadow-x) hover:translate-y-(--box-shadow-y) hover:shadow-none",
  ],
  variants: {
    variant: {
      default: "bg-neutral text-fg-on-neutral",
      primary: "bg-primary text-fg-on-primary",
      quiet: "text-fg bg-transparent",
      outline:
        "border-border-field text-fg hover:bg-inverse/10 disabled:border-border-disabled pressed:bg-inverse/15 border disabled:bg-transparent",
      accent:
        "bg-accent text-fg-on-accent hover:bg-accent-hover pressed:bg-accent-active",
      success:
        "bg-success text-fg-on-success hover:bg-success-hover pressed:bg-success-active",
      warning:
        "bg-warning text-fg-on-warning hover:bg-warning-hover pressed:bg-warning-active",
      danger:
        "bg-danger text-fg-on-danger hover:bg-danger-hover pressed:bg-danger-active",
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
  Omit<AriaLinkProps, "className" | "children" | "style"> &
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

    const Element: React.ElementType = props.href ? AriaLink : AriaButton;

    return (
      <Element
        ref={ref}
        {...restProps}
        className={buttonStyles({ variant, size, shape, className })}
      >
        {composeRenderProps(props.children, (children, { isPending }) => (
          <>
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
