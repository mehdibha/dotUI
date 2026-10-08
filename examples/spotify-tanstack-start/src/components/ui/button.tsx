"use client";

import type * as React from "react";
import * as ButtonPrimitive from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as LinkPrimitive from "react-aria-components/Link";
import { type VariantProps, tv } from "tailwind-variants";

import { Loader } from "@/components/ui/loader";

const buttonVariants = tv({
  base: "group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-full bg-clip-padding font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui focus-reset focus-visible:focus-ring **:[svg]:pointer-events-none **:[svg]:shrink-0 pending:cursor-pending pending:[-webkit-text-fill-color:transparent] pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 disabled:cursor-disabled invalid:border-fg-danger invalid:not-focus-visible:invalid-ring text-base *:[svg]:not-with-[size]:size-5",
  variants: {
    variant: {
      primary:
        "text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) bg-primary hover:bg-primary-hover pressed:bg-primary-active",
      secondary:
        "disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) border border-border-control bg-transparent text-fg-on-neutral hover:bg-neutral pressed:not-aria-expanded:bg-neutral-hover",
      quiet:
        "bg-transparent text-fg hover:bg-inverse/10 disabled:text-(--disabled-fg,var(--color-fg)) pressed:bg-inverse/20",
      link: "disabled:text-(--disabled-fg,var(--color-fg)) underline underline-offset-2 text-fg",
      warning:
        "text-fg-on-warning disabled:bg-(--disabled-bg,var(--color-warning)) disabled:text-(--disabled-fg,var(--color-fg-on-warning)) bg-warning hover:bg-warning-hover pressed:bg-warning-active",
      danger:
        "text-fg-on-danger disabled:bg-(--disabled-bg,var(--color-danger)) disabled:text-(--disabled-fg,var(--color-fg-on-danger)) bg-danger hover:bg-danger-hover pressed:bg-danger-active",
    },
    size: {
      xs: "rounded-full h-7 gap-1 px-3 text-[0.8125rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
      sm: "h-8 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4",
      md: "h-12 gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 data-icon-only:size-12",
      lg: "h-14 gap-2 px-8 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 data-icon-only:size-14",
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
        buttonVariants({ variant, size, isIconOnly, className: cn }),
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
  return (
    <LinkPrimitive.Link
      data-button=""
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (cn) =>
        buttonVariants({ variant, size, isIconOnly, className: cn }),
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
