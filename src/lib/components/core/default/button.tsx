"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import {
  Button as Button_,
  composeRenderProps,
  type ButtonProps as ButtonProps_,
  Link,
  type LinkProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const buttonVariants = tv(
  {
    extend: focusRing,
    base: "inline-flex items-center justify-center whitespace-nowrap rounded-md leading-normal text-sm font-medium ring-offset-background transition-colors disabled:cursor-not-allowed shrink-0",
    variants: {
      variant: {
        fill: "disabled:bg-bg-disabled disabled:text-fg-disabled",
        ghost: "disabled:bg-bg-disabled disabled:text-fg-disabled",
        outline: "disabled:border-border-disabled disabled:text-fg-disabled",
      },
      type: {
        neutral: "text-fg border hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20",
        primary:
          "text-fg-primary border border-border-primary hover:bg-bg-primary/10 pressed:bg-bg-primary/20",
        success:
          "text-fg-success border border-border-success hover:bg-bg-success/10 pressed:bg-bg-success/20",
        warning:
          "text-fg-warning border border-border-warning hover:bg-bg-warning/10 pressed:bg-bg-warning/20",
        danger:
          "text-fg-danger border border-border-danger hover:bg-bg-danger/10 pressed:bg-bg-danger/20",
      },
      size: {
        sm: "h-8 px-3 [&_svg]:size-4",
        md: "h-9 px-4 [&_svg]:size-4",
        lg: "h-10 px-6 [&_svg]:size-5",
      },
      shape: {
        default: "",
        square: "",
        circle: "rounded-full",
      },
    },
    compoundVariants: [
      // sizes
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
      // variant ghost
      {
        variant: "ghost",
        type: ["neutral", "primary", "success", "warning", "danger"],
        className: "border-none",
      },
      // variant outline
      {
        variant: "ghost",
        type: ["neutral", "primary", "success", "warning", "danger"],
        className: "border-none",
      },
      // variant fill
      {
        variant: "fill",
        type: "neutral",
        className:
          "bg-bg-neutral text-fg-onNeutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active",
      },
      {
        variant: "fill",
        type: "primary",
        className:
          "bg-bg-primary text-fg-onPrimary hover:bg-bg-primary-hover pressed:bg-bg-primary-active",
      },
      {
        variant: "fill",
        type: "success",
        className:
          "bg-bg-success text-fg-onSuccess hover:bg-bg-success-hover pressed:bg-bg-success-active",
      },
      {
        variant: "fill",
        type: "warning",
        className:
          "bg-bg-warning text-fg-onWarning hover:bg-bg-warning-hover pressed:bg-bg-warning-active",
      },
      {
        variant: "fill",
        type: "danger",
        className:
          "bg-bg-danger text-fg-onDanger hover:bg-bg-danger-hover pressed:bg-bg-danger-active",
      },
    ],
    defaultVariants: {
      type: "neutral",
      variant: "fill",
      size: "md",
      shape: "default",
    },
  },
  {
    responsiveVariants: ["sm"],
  }
);

export interface ButtonProps
  extends Omit<ButtonProps_, "type" | "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = ({
  variant,
  size,
  shape,
  children,
  isDisabled = false,
  isLoading = false,
  prefix,
  suffix,
  htmlType,
  type,
  ...props
}: ButtonProps) => {
  return (
    <Button_
      type={htmlType}
      isDisabled={isDisabled || isLoading}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonVariants({ ...renderProps, variant, type, size, shape, className })
      )}
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
    </Button_>
  );
};

export interface LinkButtonProps
  extends Omit<LinkProps, "type" | "children">,
    Omit<VariantProps<typeof buttonVariants>, "isDisabled"> {
  children?: React.ReactNode;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const LinkButton = ({
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
}: LinkButtonProps) => {
  return (
    <Link
      isDisabled={isDisabled || isLoading}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonVariants({ className, variant, type, size, shape, ...renderProps })
      )}
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
    </Link>
  );
};

export { Button, LinkButton, buttonVariants };
