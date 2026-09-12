"use client";

import type * as React from "react";
import * as ButtonPrimitive from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as LinkPrimitive from "react-aria-components/Link";
import { type VariantProps, tv } from "tailwind-variants";

import { Loader } from "@/components/ui/loader";

const buttonVariants = tv({
  base: "group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-full bg-clip-padding font-(--btn-font-weight) whitespace-nowrap shadow-[var(--shadow-control,0_0_#0000)] transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui focus-reset focus-visible:focus-ring **:[svg]:pointer-events-none **:[svg]:shrink-0 pending:cursor-pending pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted disabled:cursor-disabled text-sm *:[svg]:not-with-[size]:size-4",
  variants: {
    variant: {
      primary:
        "bg-primary text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) hover:bg-primary-hover pressed:bg-primary-active",
      secondary:
        "border border-border-control bg-neutral text-fg-on-neutral disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) pending:border-border hover:bg-neutral-hover pressed:bg-neutral-active",
      quiet:
        "bg-transparent text-fg disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg)) hover:bg-inverse/10 pressed:bg-inverse/20",
      link: "text-fg underline-offset-4 hover:underline disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg))",
      warning:
        "bg-warning text-fg-on-warning disabled:bg-(--disabled-bg,var(--color-warning)) disabled:text-(--disabled-fg,var(--color-fg-on-warning)) hover:bg-warning-hover pressed:bg-warning-active",
      danger:
        "bg-danger text-fg-on-danger disabled:bg-(--disabled-bg,var(--color-danger)) disabled:text-(--disabled-fg,var(--color-fg-on-danger)) hover:bg-danger-hover pressed:bg-danger-active",
    },
    size: {
      xs: "h-6 gap-1 px-2 text-xs has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
      sm: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
      md: "h-8 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5",
      lg: "h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4",
    },
    isIconOnly: {
      true: "p-0",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});

export { buttonVariants as buttonStyles };

type ButtonVariants = VariantProps<typeof buttonVariants>;

/* -------------------------------------------------------------------------- */

interface ButtonProps
  extends React.ComponentProps<typeof ButtonPrimitive.Button>, ButtonVariants {
  isIconOnly?: boolean;
}

const Button = ({
  variant,
  size,
  isIconOnly,
  className,
  children,
  ...props
}: ButtonProps) => {
  const styles = buttonVariants;

  const renderChildren = composeRenderProps(
    children,
    (children, { isPending }) => (
      <>
        {isPending && (
          <Loader
            data-slot="spinner"
            aria-label="loading"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {typeof children === "string" ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
      </>
    ),
  );

  return (
    <ButtonPrimitive.Button
      data-button=""
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (cn) =>
        styles({ variant, size, isIconOnly, className: cn }),
      )}
      {...props}
      // Only wrap provided children: passing a render function when `children`
      // is undefined would override context-injected children (e.g. the
      // ColorPicker trigger's default swatch) in RAC's context merge.
      children={children === undefined ? undefined : renderChildren}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface LinkButtonProps
  extends
    React.ComponentProps<typeof LinkPrimitive.Link>,
    VariantProps<typeof buttonVariants> {
  isIconOnly?: boolean;
}

const LinkButton = ({
  variant,
  size,
  isIconOnly,
  className,
  children,
  ...props
}: LinkButtonProps) => {
  const styles = buttonVariants;

  return (
    <LinkPrimitive.Link
      data-button=""
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (cn) =>
        styles({ variant, size, isIconOnly, className: cn }),
      )}
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
    </LinkPrimitive.Link>
  );
};

/* -------------------------------------------------------------------------- */

export type { ButtonProps, LinkButtonProps };
export { Button, LinkButton };
