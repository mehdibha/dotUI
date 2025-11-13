"use client";

import type * as React from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonContext as AriaToggleButtonContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@dotui/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@dotui/registry/lib/context";

const toggleButtonStyles = tv({
  base: [
    "inline-flex shrink-0 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",

    // focus state
    "focus-reset focus-visible:focus-ring",

    // selected state
    "selected:bg-selected selected:pressed:bg-selected-active not-selected:text-fg-muted selected:text-fg-on-selected selected:hover:bg-selected-hover",

    // disabled state
    "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled disabled:text-fg-disabled",
  ],
  variants: {
    variant: {
      default:
        "border pressed:border-border-active selected:not-data-disabled:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
      quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
    },
    size: {
      sm: "h-8 px-3 data-icon-only:w-8 [&_svg]:size-4",
      md: "h-9 px-4 data-icon-only:w-9 [&_svg]:size-4",
      lg: "h-10 px-5 data-icon-only:w-10 [&_svg]:size-5",
    },
  },
});

type ToggleButtonVariants = VariantProps<typeof toggleButtonStyles>;

/* -----------------------------------------------------------------------------------------------*/

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
  ToggleButtonVariants,
  React.ComponentProps<typeof AriaToggleButton>
>(AriaToggleButtonContext);

/* -----------------------------------------------------------------------------------------------*/

interface ToggleButtonProps
  extends React.ComponentProps<typeof AriaToggleButton>,
    ToggleButtonVariants {
  aspect?: "default" | "square" | "auto";
}

const ToggleButton = (localProps: ToggleButtonProps) => {
  const {
    variant = "default",
    size = "md",
    aspect = "auto",
    className,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaToggleButton
      data-slot="button"
      data-icon-only={isIconOnly || undefined}
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (cn) =>
        toggleButtonStyles({
          variant,
          size,
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
    </AriaToggleButton>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ToggleButton, ToggleButtonProvider, toggleButtonStyles };

export type { ToggleButtonProps };
