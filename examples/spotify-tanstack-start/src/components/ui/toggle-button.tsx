"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ToggleButtonPrimitive from "react-aria-components/ToggleButton";
import { type VariantProps, tv } from "tailwind-variants";

import { createVariantsContext } from "@/lib/context";

const toggleButtonVariants = tv({
  base: "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-full bg-clip-padding font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui focus-reset focus-visible:focus-ring **:[svg]:pointer-events-none **:[svg]:shrink-0 disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected)) text-base *:[svg]:not-with-[size]:size-5",
  variants: {
    variant: {
      primary:
        "text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) bg-primary hover:bg-primary-hover pressed:bg-primary-active selected:bg-(--surface-bg,var(--color-bg)) selected:text-fg selected:shadow-none selected:inset-ring selected:inset-ring-inverse selected:hover:bg-muted selected:pressed:bg-highlight",
      secondary:
        "disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) border border-border-control bg-transparent text-fg-on-neutral hover:bg-neutral pressed:not-aria-expanded:bg-neutral-hover selected:border-inverse selected:bg-inverse selected:text-fg-inverse selected:hover:bg-inverse/90 selected:pressed:bg-inverse/80",
      quiet:
        "bg-transparent text-fg hover:bg-inverse/10 disabled:text-(--disabled-fg,var(--color-fg)) pressed:bg-inverse/20 selected:bg-inverse selected:hover:bg-inverse/90 selected:pressed:bg-inverse/80 selected:text-fg-inverse",
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
  compoundVariants: [
    {
      variant: "primary",
      class:
        "disabled:selected:bg-(--color-primary-disabled,var(--color-selected))",
    },
  ],
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
        toggleButtonVariants({
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
