"use client";

import * as React from "react";
import {
  ToggleButton as AriaToggleButton,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "../hooks/use-button-aspect";

const toggleButtonStyles = tv({
  base: [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium transition-[background-color,border-color,color,box-shadow]",

    // focus state
    "focus-reset focus-visible:focus-ring",

    // disabled state
    "disabled:cursor-default disabled:bg-disabled disabled:text-fg-disabled",
  ],
  variants: {
    variant: {
      quiet:
        "bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20 selected:bg-primary selected:text-fg-on-primary selected:hover:bg-primary-hover selected:pressed:bg-primary-active",
    },
    size: {
      sm: "h-8 px-3 data-icon-only:w-8 [&_svg]:size-4",
      md: "h-9 px-4 data-icon-only:w-9 [&_svg]:size-4",
      lg: "h-10 px-5 data-icon-only:w-10 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    variant: "quiet",
    size: "md",
  },
});

/* -----------------------------------------------------------------------------------------------*/

interface ToggleButtonProps
  extends React.ComponentProps<typeof AriaToggleButton>,
    VariantProps<typeof toggleButtonStyles> {
  aspect?: "default" | "square" | "auto";
}

const ToggleButton = ({
  aspect = "auto",
  variant,
  size,
  className,
  ...props
}: ToggleButtonProps) => {
  const isIconOnly = useButtonAspect(props.children, aspect);

  return (
    <AriaToggleButton
      data-slot="button"
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        toggleButtonStyles({ variant, size, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
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

export { ToggleButton, toggleButtonStyles };

export type { ToggleButtonProps };
