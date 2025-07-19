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
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-all disabled:cursor-default disabled:border disabled:border-border-disabled disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:border pending:border-border-disabled pending:bg-bg-disabled pending:text-fg-disabled pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0",
  variants: {
    variant: {
      default:
        "border bg-bg-neutral text-fg-onNeutral hover:border-border-hover hover:bg-bg-neutral-hover",
      primary: "bg-bg-primary text-fg-on-primary hover:bg-bg-primary-hover",
      quiet:
        "bg-transparent text-fg hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20",
      outline:
        "border border-border-field text-fg hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15",
      accent:
        "border border-border-accent bg-bg-accent-muted text-fg-on-accent hover:border-border-accent-hover hover:bg-bg-accent-muted-hover",
      success:
        "hover:bg-bg-success-muted-hover border border-border-success bg-bg-success-muted text-fg-on-success hover:border-border-success-hover",
      warning:
        "hover:bg-bg-warning-muted-hover border border-border-warning bg-bg-warning-muted text-fg-on-warning hover:border-border-warning-hover",
      danger:
        "hover:bg-bg-danger-muted-hover border border-border-danger bg-bg-danger-muted text-fg-on-danger hover:border-border-danger-hover",
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
