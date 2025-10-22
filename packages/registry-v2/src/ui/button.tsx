"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Button as AriaButton,
  ButtonContext as AriaButtonContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@dotui/registry-v2/hooks/use-button-aspect";
import { Loader } from "@dotui/registry-v2/ui/loader";

import { createVariantsContext } from "../lib/utils-v2";

const buttonStyles = tv({
  base: [
    "relative box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    // focus state
    "focus-reset focus-visible:focus-ring",
    // disabled state
    "disabled:cursor-default disabled:border disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
    // pending state
    "pending:cursor-default pending:border pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
  ],
  variants: {
    variant: {
      default:
        "border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover pressed:bg-neutral-active",
      primary:
        "bg-primary text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0 pending:border-0 pressed:bg-primary-active",
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

type ButtonVariants = VariantProps<typeof buttonStyles>;

/* -----------------------------------------------------------------------------------------------*/

const [ButtonProvider, useContextProps] = createVariantsContext<
  ButtonVariants,
  React.ComponentProps<typeof AriaButton>
>(AriaButtonContext);

/* -----------------------------------------------------------------------------------------------*/

interface ButtonProps
  extends React.ComponentProps<typeof AriaButton>,
    ButtonVariants {
  aspect?: "default" | "square" | "auto";
  asChild?: boolean;
}

const Button = (localProps: ButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    asChild,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        data-icon-only={isIconOnly || undefined}
        className={buttonStyles({
          variant,
          size,
          className: className as string,
        })}
        slot={slot!}
        style={style as React.CSSProperties}
        {...props}
      >
        {typeof children === "function" ? children({} as any) : children}
      </Slot>
    );
  }

  return (
    <AriaButton
      data-slot="button"
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
      slot={slot}
      style={style}
      {...props}
    >
      {composeRenderProps(children, (children, { isPending }) => (
        <>
          {isPending && (
            <Loader
              data-slot="spinner"
              aria-label="loading"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              size={16}
            />
          )}
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaButton>
  );
};

export type { ButtonProps };
export { Button, ButtonProvider, buttonStyles };
