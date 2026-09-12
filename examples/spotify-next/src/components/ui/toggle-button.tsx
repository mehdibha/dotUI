"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ToggleButtonPrimitive from "react-aria-components/ToggleButton";
import { type VariantProps, tv } from "tailwind-variants";

import { createVariantsContext } from "@/lib/context";

const toggleButtonVariants = tv({
  base: "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-full bg-clip-padding font-(--btn-font-weight) whitespace-nowrap shadow-[var(--shadow-control,0_0_#0000)] transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui focus-reset focus-visible:focus-ring **:[svg]:pointer-events-none **:[svg]:shrink-0 disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected)) text-sm *:[svg]:not-with-[size]:size-4 selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",
  variants: {
    variant: {
      primary:
        "bg-primary text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) disabled:selected:bg-(--color-primary-disabled,var(--color-selected)) hover:bg-primary-hover pressed:bg-primary-active",
      secondary:
        "border border-border-control bg-neutral text-fg-on-neutral disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) hover:bg-neutral-hover pressed:bg-neutral-active",
      quiet:
        "bg-transparent text-fg disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg)) hover:bg-inverse/10 pressed:bg-inverse/20",
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

export { toggleButtonVariants as toggleButtonStyles };

type ToggleButtonVariants = VariantProps<typeof toggleButtonVariants>;

/* -------------------------------------------------------------------------- */

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
  ToggleButtonVariants,
  React.ComponentProps<typeof ToggleButtonPrimitive.ToggleButton>,
  HTMLButtonElement
>(ToggleButtonPrimitive.ToggleButtonContext);

/* -------------------------------------------------------------------------- */

interface ToggleButtonProps
  extends
    React.ComponentProps<typeof ToggleButtonPrimitive.ToggleButton>,
    ToggleButtonVariants {
  isIconOnly?: boolean;
}

const ToggleButton = (localProps: ToggleButtonProps) => {
  const styles = toggleButtonVariants;
  const {
    variant = "secondary",
    size = "md",
    isIconOnly,
    className,
    children,
    ...props
  } = useContextProps(localProps);

  return (
    <ToggleButtonPrimitive.ToggleButton
      data-button=""
      data-toggle-button=""
      data-variant={variant}
      data-size={size}
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (cn) =>
        styles({
          variant,
          size,
          isIconOnly,
          className: cn,
        }),
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
    </ToggleButtonPrimitive.ToggleButton>
  );
};

/* -------------------------------------------------------------------------- */

export type { ToggleButtonProps };
export { ToggleButton, ToggleButtonProvider };
