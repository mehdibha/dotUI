"use client";

import * as React from "react";
import {
  composeRenderProps,
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";

const toggleButtonStyles = tv({
  extend: focusRing,
  base: "ring-offset-background disabled:bg-bg-disabled disabled:text-fg-disabled inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium leading-normal transition-colors disabled:cursor-default",
  variants: {
    variant: {
      quiet:
        "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg selected:bg-bg-primary selected:text-fg-onPrimary selected:hover:bg-bg-primary-hover selected:pressed:bg-bg-primary-active bg-transparent",
      outline:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 pressed:border-transparent text-fg selected:bg-bg-primary selected:border-transparent selected:text-fg-onPrimary selected:hover:bg-bg-primary-hover selected:pressed:bg-bg-primary-active border bg-transparent",
      accent:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 pressed:border-transparent text-fg selected:bg-bg-accent selected:border-transparent selected:hover:bg-bg-accent-hover selected:pressed:bg-bg-accent-active selected:text-fg-onAccent border bg-transparent",
    },
    size: {
      sm: "size-8 [&_svg]:size-4",
      md: "size-9 [&_svg]:size-4",
      lg: "size-10 [&_svg]:size-5",
    },
    shape: {
      rectangle: "",
      square: "",
      circle: "rounded-full",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      shape: "rectangle",
      className: "w-auto px-3",
    },
    {
      size: "md",
      shape: "rectangle",
      className: "w-auto px-4",
    },
    {
      size: "lg",
      shape: "rectangle",
      className: "w-auto px-5",
    },
  ],
  defaultVariants: {
    variant: "quiet",
    size: "md",
    shape: "square",
  },
});

interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, "className">,
    VariantProps<typeof toggleButtonStyles> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const ToggleButton = React.forwardRef(
  (
    localProps: ToggleButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const contextProps = useToggleButtonContext();
    const props = { ...contextProps, ...localProps };
    const { className, variant, size, shape, prefix, suffix, ...restProps } =
      props;
    return (
      <AriaToggleButton
        ref={ref}
        {...restProps}
        className={toggleButtonStyles({
          variant,
          size,
          shape,
          className,
        })}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {prefix}
            {typeof children === "string" ? (
              <span className="truncate">{children}</span>
            ) : (
              children
            )}
            {suffix}
          </>
        ))}
      </AriaToggleButton>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

type ToggleButtonContextValue = VariantProps<typeof toggleButtonStyles>;
const ToggleButtonContext = React.createContext<ToggleButtonContextValue>({});
const useToggleButtonContext = () => {
  return React.useContext(ToggleButtonContext);
};

export type { ToggleButtonProps };
export { ToggleButton, toggleButtonStyles, ToggleButtonContext };
