"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import {
  composeRenderProps,
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const buttonStyles = tv({
  extend: focusRing,
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md leading-normal text-sm font-medium ring-offset-background transition-colors disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:border disabled:border-border-disabled disabled:text-fg-disabled shrink-0",
  variants: {
    variant: {
      default:
        "bg-bg-neutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active text-fg-onNeutral",
      primary:
        "bg-bg-primary hover:bg-bg-primary-hover pressed:bg-bg-primary-active text-fg-onPrimary",
      success:
        "bg-bg-success hover:bg-bg-success-hover pressed:bg-bg-success-active text-fg-onSuccess",
      warning:
        "bg-bg-warning hover:bg-bg-warning-hover pressed:bg-bg-warning-active text-fg-onWarning",
      danger:
        "bg-bg-danger hover:bg-bg-danger-hover pressed:bg-bg-danger-active text-fg-onDanger",
      accent:
        "bg-bg-accent hover:bg-bg-accent-hover pressed:bg-bg-accent-active text-fg-onAccent",
      quiet: "bg-transparent hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg",
      outline:
        "border border-border-field bg-transparent hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg",
    },
    size: {
      sm: "h-8 px-3 [&_svg]:size-4",
      md: "h-9 px-4 [&_svg]:size-4",
      lg: "h-10 px-5 [&_svg]:size-5",
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
      shape: ["square", "circle"],
      className: "w-8 px-0",
    },
    {
      size: "md",
      shape: ["square", "circle"],
      className: "w-9 px-0",
    },
    {
      size: "lg",
      shape: ["square", "circle"],
      className: "w-10 px-0",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    shape: "rectangle",
  },
});

interface ButtonProps
  extends Omit<AriaButtonProps, "className">,
    VariantProps<typeof buttonStyles> {
  className?: string;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = ({
  className,
  variant,
  size,
  shape,
  isDisabled = false,
  isLoading = false,
  prefix,
  suffix,
  type,
  ...props
}: ButtonProps) => {
  return (
    <AriaButton
      {...props}
      isDisabled={isDisabled || isLoading}
      className={buttonStyles({ variant, size, shape, className })}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {(prefix ?? isLoading) && (
            <span className="mr-2 shrink-0">
              {isLoading ? (
                <>
                  <Loader2Icon className="size-6 animate-spin" aria-hidden="true" />
                  <span className="sr-only">loading</span>
                </>
              ) : (
                prefix
              )}
            </span>
          )}
          <span className="truncate">{children}</span>
          {suffix && <span className="ml-2 shrink-0">{suffix}</span>}
        </>
      ))}
    </AriaButton>
  );
};

interface LinkButtonProps
  extends Omit<LinkProps, "className">,
    VariantProps<typeof buttonStyles> {
  className?: string;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const LinkButton = ({
  className,
  variant,
  size,
  shape,
  isDisabled = false,
  isLoading = false,
  prefix,
  suffix,
  ...props
}: LinkButtonProps) => {
  return (
    <AriaLink
      isDisabled={isDisabled || isLoading}
      {...props}
      className={buttonStyles({ className, variant, size, shape })}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {(prefix ?? isLoading) && (
            <span className="mr-2">
              {isLoading ? (
                <>
                  <Loader2Icon className="size-6 animate-spin" aria-hidden="true" />
                  <span className="sr-only">loading</span>
                </>
              ) : (
                prefix
              )}
            </span>
          )}
          {children}
          {suffix && <span className="ml-2">{suffix}</span>}
        </>
      ))}
    </AriaLink>
  );
};

export type { ButtonProps, LinkButtonProps };
export { Button, LinkButton, buttonStyles };
