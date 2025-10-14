"use client";

import * as React from "react";
import { ReactNode } from "react";
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
  useContextProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  ButtonProps as AriaButtonProps,
  LinkProps as AriaLinkProps,
  ContextValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { useIconOnly } from "@dotui/registry-v2/hooks/use-icon-only";
import { focusRing } from "@dotui/registry-v2/lib/focus-styles";
import {
  createContext,
  createOptionalScopedContext,
} from "@dotui/registry-v2/lib/utils";
import { Loader } from "@dotui/registry-v2/ui/loader";

const buttonStyles = tv({
  extend: focusRing,
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-all disabled:cursor-default disabled:border disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled data-icon-only:px-0 pending:cursor-default pending:border pending:border-border-disabled pending:bg-disabled pending:text-fg-disabled pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0",
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
      sm: "h-8 px-3 data-icon-only:w-8 [&_svg]:size-4",
      md: "h-9 px-4 data-icon-only:w-9 [&_svg]:size-4",
      lg: "h-10 px-5 data-icon-only:w-10 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

/* -----------------------------------------------------------------------------------------------*/

interface ButtonProps
  extends React.ComponentProps<typeof AriaButton>,
    VariantProps<typeof buttonStyles> {
  aspect?: "default" | "square" | "auto";
}

const Button = ({
  aspect = "auto",
  variant,
  size,
  className,
  ...props
}: ButtonProps) => {
  const isIconOnly = useButtonAspect(props.children, aspect);

  return (
    <AriaButton
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
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
          {children}
        </>
      ))}
    </AriaButton>
  );
};

export type { ButtonProps };
export { Button, buttonStyles };

/**
 * Returns true if the button should be square, otherwise false.
 *
 */

const useButtonAspect = (
  children: React.ReactNode,
  aspect: "default" | "square" | "auto",
): boolean => {
  if (aspect === "default" || aspect === "square") {
    return aspect === "square";
  }

  const getTextContent = (children: React.ReactNode): string => {
    return React.Children.toArray(children).reduce(
      (text: string, child: React.ReactNode): string => {
        if (typeof child === "string" || typeof child === "number") {
          return text + child;
        }
        if (React.isValidElement(child)) {
          if (child?.props?.children) {
            return text + getTextContent(child.props.children as ReactNode);
          }
          return text;
        }
        return text;
      },
      "",
    );
  };

  const textContent = getTextContent(children);

  return textContent.trim() === "";
};
