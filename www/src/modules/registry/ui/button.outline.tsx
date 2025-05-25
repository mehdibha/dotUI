"use client";

import * as React from "react";
import {
  composeRenderProps,
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/modules/registry/lib/focus-styles";
import { createOptionalScopedContext } from "@/modules/registry/lib/utils";
import { Loader } from "@/modules/registry/ui/loader.ring";

const buttonStyles = tv({
  extend: focusRing,
  base: "disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:bg-bg-disabled pending:text-fg-disabled pending:border pending:border-border-disabled pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium leading-normal transition-all disabled:cursor-default",
  variants: {
    variant: {
      default:
        "bg-bg-neutral hover:bg-bg-neutral-hover text-fg-onNeutral border hover:border-border-hover",
      primary:
        "bg-bg-primary hover:bg-bg-primary-hover text-fg-onPrimary",
      quiet:
        "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg bg-transparent",
      outline:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15 text-fg disabled:border-border-disabled border disabled:bg-transparent",
      accent:
        "bg-bg-accent-muted hover:bg-bg-accent-muted-hover text-fg-onAccent border border-border-accent hover:border-border-accent-hover",
      success:
        "bg-bg-success-muted hover:bg-bg-success-muted-hover text-fg-onSuccess border border-border-success hover:border-border-success-hover",
      warning:
        "bg-bg-warning-muted hover:bg-bg-warning-muted-hover text-fg-onWarning border border-border-warning hover:border-border-warning-hover",
      danger:
        "bg-bg-danger-muted hover:bg-bg-danger-muted-hover text-fg-onDanger border border-border-danger hover:border-border-danger-hover",
    },
    size: {
      sm: "size-7 [&_svg]:size-4",
      md: "size-8 [&_svg]:size-4",
      lg: "size-9 [&_svg]:size-5",
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
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
  }
);
Button.displayName = "Button";

export type { ButtonProps };
export { Button, buttonStyles, ButtonProvider };
