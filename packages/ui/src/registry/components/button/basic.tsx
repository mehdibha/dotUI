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
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-all disabled:cursor-default disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:border pending:border-border-disabled pending:bg-bg-disabled pending:text-fg-disabled pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0",
  variants: {
    variant: {
      default:
        "bg-bg-neutral text-fg-onNeutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active",
      primary:
        "bg-bg-primary text-fg-onPrimary hover:bg-bg-primary-hover pressed:bg-bg-primary-active",
      quiet:
        "bg-transparent text-fg hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20",
      outline:
        "border border-border-field text-fg hover:bg-bg-inverse/10 disabled:border-border-disabled disabled:bg-transparent pressed:bg-bg-inverse/15",
      accent:
        "bg-bg-accent text-fg-onAccent hover:bg-bg-accent-hover pressed:bg-bg-accent-active",
      success:
        "bg-bg-success text-fg-onSuccess hover:bg-bg-success-hover pressed:bg-bg-success-active",
      warning:
        "bg-bg-warning text-fg-onWarning hover:bg-bg-warning-hover pressed:bg-bg-warning-active",
      danger:
        "bg-bg-danger text-fg-onDanger hover:bg-bg-danger-hover pressed:bg-bg-danger-active",
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

    const Element: React.ElementType = props.href ? AriaLink : AriaButton;

    return (
      <Element
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
