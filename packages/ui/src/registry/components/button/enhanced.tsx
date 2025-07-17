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
import { useDynamicFocusRing } from "@dotui/ui/helpers/focus-provider";
import { createOptionalScopedContext } from "@dotui/ui/lib/utils";

const EnhancedButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AriaButton> & {
    variant?:
      | "default"
      | "primary"
      | "quiet"
      | "outline"
      | "accent"
      | "success"
      | "warning"
      | "danger";
    size?: "sm" | "md" | "lg";
    shape?: "rectangle" | "square" | "circle";
    isPending?: boolean;
  }
>(
  (
    {
      className,
      variant = "default",
      size = "md",
      shape = "rectangle",
      isPending,
      children,
      ...props
    },
    ref,
  ) => {
    const dynamicFocusRing = useDynamicFocusRing();

    const buttonStyles = tv({
      extend: dynamicFocusRing,
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
          className: "px-3",
        },
        {
          size: "md",
          shape: "rectangle",
          className: "px-4",
        },
        {
          size: "lg",
          shape: "rectangle",
          className: "px-5",
        },
      ],
    });

    return (
      <AriaButton
        ref={ref}
        {...props}
        data-pending={isPending ? "" : undefined}
        className={composeRenderProps(className, (className) =>
          buttonStyles({ variant, size, shape, className }),
        )}
      >
        {composeRenderProps(children, (children) => (
          <>
            {isPending && (
              <Loader
                data-slot="spinner"
                className="absolute inset-0 grid place-items-center"
              />
            )}
            {children}
          </>
        ))}
      </AriaButton>
    );
  },
);
EnhancedButton.displayName = "EnhancedButton";

const EnhancedLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof AriaLink> & {
    variant?:
      | "default"
      | "primary"
      | "quiet"
      | "outline"
      | "accent"
      | "success"
      | "warning"
      | "danger";
    size?: "sm" | "md" | "lg";
    shape?: "rectangle" | "square" | "circle";
  }
>(
  (
    {
      className,
      variant = "default",
      size = "md",
      shape = "rectangle",
      children,
      ...props
    },
    ref,
  ) => {
    const dynamicFocusRing = useDynamicFocusRing();

    const buttonStyles = tv({
      extend: dynamicFocusRing,
      base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-all",
      variants: {
        variant: {
          default:
            "bg-bg-neutral text-fg-onNeutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active",
          primary:
            "bg-bg-primary text-fg-onPrimary hover:bg-bg-primary-hover pressed:bg-bg-primary-active",
          quiet:
            "bg-transparent text-fg hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20",
          outline:
            "border border-border-field text-fg hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15",
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
          className: "px-3",
        },
        {
          size: "md",
          shape: "rectangle",
          className: "px-4",
        },
        {
          size: "lg",
          shape: "rectangle",
          className: "px-5",
        },
      ],
    });

    return (
      <AriaLink
        ref={ref}
        {...props}
        className={composeRenderProps(className, (className) =>
          buttonStyles({ variant, size, shape, className }),
        )}
      >
        {children}
      </AriaLink>
    );
  },
);
EnhancedLink.displayName = "EnhancedLink";

const [ButtonProvider, useButtonProvider] = createOptionalScopedContext<{
  size?: "sm" | "md" | "lg";
  variant?:
    | "default"
    | "primary"
    | "quiet"
    | "outline"
    | "accent"
    | "success"
    | "warning"
    | "danger";
}>("ButtonProvider");

export type ButtonProps = React.ComponentPropsWithoutRef<typeof EnhancedButton>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, variant, ...props }, ref) => {
    const context = useButtonProvider();
    return (
      <EnhancedButton
        ref={ref}
        size={size ?? context?.size}
        variant={variant ?? context?.variant}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, ButtonProvider, EnhancedButton, EnhancedLink };
