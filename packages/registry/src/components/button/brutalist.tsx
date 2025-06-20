"use client";

import type {
  ButtonProps as AriaButtonProps,
  LinkProps as AriaLinkProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { focusRing } from "@/lib/focus-styles";
import { createOptionalScopedContext } from "@/lib/utils";
import { Loader } from "@/ui/loader.ring";
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const buttonStyles = tv({
  extend: focusRing,
  base: [
    "disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:bg-bg-disabled pending:text-fg-disabled pending:border pending:border-border-disabled inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-all disabled:cursor-default",
    "shadow-brutalism hover:translate-x-(--box-shadow-x) hover:translate-y-(--box-shadow-y) hover:shadow-none",
  ],
  variants: {
    variant: {
      default: "bg-bg-neutral text-fg-onNeutral",
      primary: "bg-bg-primary text-fg-onPrimary",
      quiet: "text-fg bg-transparent",
      outline:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15 text-fg disabled:border-border-disabled border disabled:bg-transparent",
      accent:
        "bg-bg-accent hover:bg-bg-accent-hover pressed:bg-bg-accent-active text-fg-onAccent",
      success:
        "bg-bg-success hover:bg-bg-success-hover pressed:bg-bg-success-active text-fg-onSuccess",
      warning:
        "bg-bg-warning hover:bg-bg-warning-hover pressed:bg-bg-warning-active text-fg-onWarning",
      danger:
        "bg-bg-danger hover:bg-bg-danger-hover pressed:bg-bg-danger-active text-fg-onDanger",
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
