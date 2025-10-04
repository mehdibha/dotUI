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

import { focusRing } from "@dotui/registry/lib/focus-styles";
import { createOptionalScopedContext } from "@dotui/registry/lib/utils";
import { Loader } from "@dotui/registry/ui/loader";

const buttonStyles = tv({
  extend: focusRing,
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-all disabled:cursor-default disabled:border disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled pending:cursor-default pending:border pending:border-border-disabled pending:bg-disabled pending:text-fg-disabled pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0",
  variants: {
    variant: {
      default:
        "border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover active:bg-neutral-active",
      primary:
        "bg-primary text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0 pending:border-0",
      quiet: "bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20",
      link: "text-fg underline-offset-4 hover:underline",
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

    const Element: React.ElementType = props.href ? AriaLink : AriaButton;

    return (
      <Element
        data-slot="button"
        ref={ref}
        {...restProps}
        className={buttonStyles({ variant, size, shape, className })}
      >
        {composeRenderProps(props.children, (children, { isPending }) => (
          <>
            {isPending && (
              <Loader
                data-slot="spinner"
                aria-label="loading"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                size={16}
              />
            )}
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
