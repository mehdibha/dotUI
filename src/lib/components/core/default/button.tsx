"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type LinkProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const buttonVariants = tv(
  {
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
        ghost: "bg-transparent hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg",
        outline:
          "border border-border-field bg-transparent hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg",
      },
      size: {
        sm: "h-8 px-3 [&_svg]:size-4",
        md: "h-9 px-4 [&_svg]:size-4",
        lg: "h-10 px-6 [&_svg]:size-5",
      },
      shape: {
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
    },
  },
  {
    responsiveVariants: ["sm"],
  }
);

export interface ButtonProps
  extends Omit<AriaButtonProps, "children" | "className">,
    VariantProps<typeof buttonVariants> {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = ({
  className,
  variant,
  size,
  shape,
  children,
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
      className={buttonVariants({ variant, size, shape, className })}
    >
      {({}) => (
        <>
          {(prefix ?? isLoading) && (
            <span className="pointer-events-none mr-2">
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
          {suffix && <span className="pointer-events-none ml-2">{suffix}</span>}
        </>
      )}
    </AriaButton>
  );
};

export interface LinkButtonProps
  extends Omit<LinkProps, "children" | "className">,
    Omit<VariantProps<typeof buttonVariants>, "isDisabled"> {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const LinkButton = ({
  className,
  variant,
  size,
  shape,
  children,
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
      className={buttonVariants({ className, variant, size, shape })}
    >
      {({}) => (
        <>
          {(prefix ?? isLoading) && (
            <span className="pointer-events-none mr-2">
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
          {suffix && <span className="pointer-events-none ml-2">{suffix}</span>}
        </>
      )}
    </AriaLink>
  );
};

export { Button, LinkButton, buttonVariants };
