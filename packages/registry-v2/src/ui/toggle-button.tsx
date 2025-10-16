"use client";

import * as React from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonContext as AriaToggleButtonContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "../hooks/use-button-aspect";

const toggleButtonStyles = tv({
  base: [
    "inline-flex shrink-0 cursor-default items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",

    // focus state
    "focus-reset focus-visible:focus-ring",

    // selected state
    "not-selected:text-fg-muted selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",

    // disabled state
    "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-fg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled",
  ],
  variants: {
    variant: {
      default:
        "border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover pressed:bg-neutral-active",
      quiet: "bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20",
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

const ToggleButtonContext = React.createContext<
  VariantProps<typeof toggleButtonStyles>
>({});

interface ToggleButtonProviderProps
  extends Omit<React.ComponentProps<typeof AriaToggleButton>, "children">,
    VariantProps<typeof toggleButtonStyles> {
  children: React.ReactNode;
}

const ToggleButtonProvider = ({
  children,
  variant,
  size,
  ...props
}: ToggleButtonProviderProps) => {
  return (
    <ToggleButtonContext.Provider value={{ variant, size }}>
      <AriaToggleButtonContext.Provider value={props}>
        {children}
      </AriaToggleButtonContext.Provider>
    </ToggleButtonContext.Provider>
  );
};

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
  const context = React.useContext(ToggleButtonContext);

  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;

  return (
    <AriaToggleButton
      data-slot="button"
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        toggleButtonStyles({
          variant: resolvedVariant,
          size: resolvedSize,
          className: cn,
        }),
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

export { ToggleButton, ToggleButtonProvider, toggleButtonStyles };

export type { ToggleButtonProps, ToggleButtonProviderProps };
