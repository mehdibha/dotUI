"use client";

import type * as React from "react";
import {
  Button as AriaButton,
  ButtonContext as AriaButtonContext,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@dotui/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@dotui/registry/lib/context";
import { Loader } from "@dotui/registry/ui/loader";

const buttonStyles = tv({
  base: [
    "relative box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    // focus state
    "focus-reset focus-visible:focus-ring",
    // disabled state
    "disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
    // pending state
    "pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
  ],
  variants: {
    variant: {
      default:
        "border pressed:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
      primary:
        "pending:border-0 bg-primary pressed:bg-primary-active text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0",
      quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
      link: "text-fg underline-offset-4 hover:underline",
      success:
        "bg-success pressed:bg-success-active text-fg-on-success hover:bg-success-hover",
      warning:
        "bg-warning pressed:bg-warning-active text-fg-on-warning hover:bg-warning-hover",
      danger:
        "bg-danger pressed:bg-danger-active text-fg-on-danger hover:bg-danger-hover",
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

const [ButtonProvider, useContextProps] = createVariantsContext<
  ButtonVariants,
  React.ComponentProps<typeof AriaButton>
>(AriaButtonContext);

/* -----------------------------------------------------------------------------------------------*/

interface ButtonProps
  extends React.ComponentProps<typeof AriaButton>,
    ButtonVariants {
  aspect?: "default" | "square" | "auto";
}

const Button = (localProps: ButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaButton
      data-slot="button"
      data-button=""
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
              className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
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

/* -----------------------------------------------------------------------------------------------*/

interface LinkButtonProps
  extends React.ComponentProps<typeof AriaLink>,
    VariantProps<typeof buttonStyles> {
  aspect?: "default" | "square" | "auto";
}

const LinkButton = (localProps: LinkButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaLink
      data-slot="button"
      data-button=""
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
      slot={slot}
      style={style}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaLink>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { ButtonProps, LinkButtonProps };

export { Button, LinkButton, ButtonProvider, buttonStyles };
