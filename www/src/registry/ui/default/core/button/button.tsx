"use client";

import * as React from "react";
import {
  composeRenderProps,
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";
import { LoaderIcon } from "@/__icons__";

const buttonStyles = tv(
  {
    extend: focusRing,
    base: "ring-offset-background disabled:bg-bg-disabled disabled:text-fg-disabled inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium leading-normal transition-colors disabled:cursor-default",
    variants: {
      variant: {
        default:
          "bg-bg-neutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active text-fg-onNeutral",
        primary:
          "bg-bg-primary hover:bg-bg-primary-hover pressed:bg-bg-primary-active text-fg-onPrimary",
        quiet:
          "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg bg-transparent",
        outline:
          "border-border-field bg-bg-inverse/5 hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15 text-fg disabled:border-border-disabled border disabled:bg-transparent",
        accent:
          "bg-bg-accent hover:bg-bg-accent-hover pressed:bg-bg-accent-active text-fg-onAccent",
        success:
          "bg-bg-success hover:bg-bg-success-hover pressed:bg-bg-success-active text-fg-onSuccess",
        warning:
          "bg-bg-warning hover:bg-bg-warning-hover pressed:bg-bg-warning-active text-fg-onWarning",
        danger:
          "bg-bg-danger hover:bg-bg-danger-hover pressed:bg-bg-danger-active text-fg-onDanger",
      },
      size: {
        sm: "h-8 px-3 [&_svg]:size-4",
        md: "h-9 px-4 [&_svg]:size-4",
        lg: "h-10 px-5 [&_svg]:size-5",
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
        shape: ["square", "circle"],
        className: "w-8 px-0",
      },
      {
        size: "md",
        shape: ["square", "circle"],
        className: "w-9 px-0",
      },
      {
        size: "lg",
        shape: ["square", "circle"],
        className: "w-10 px-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rectangle",
    },
  },
  {
    responsiveVariants: ["sm", "lg"],
  }
);

interface ButtonProps
  extends Omit<AriaButtonProps, "className">,
    Omit<AriaLinkProps, "className" | "children" | "style">,
    VariantProps<typeof buttonStyles> {
  className?: string;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = React.forwardRef(
  (localProps: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const contextProps = useButtonContext();
    const props = { ...contextProps, ...localProps };

    const {
      className,
      variant,
      size,
      shape,
      isDisabled,
      isLoading,
      prefix,
      suffix,
      ...restProps
    } = props;

    const Element: React.ElementType = props.href ? AriaLink : AriaButton;

    return (
      <Element
        ref={ref}
        {...restProps}
        isDisabled={isDisabled || isLoading}
        className={buttonStyles({ variant, size, shape, className })}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {isLoading ? (
              <LoaderIcon aria-label="loading" className="animate-spin" />
            ) : (
              prefix
            )}
            {typeof children === "string" ? (
              <span className="truncate">{children}</span>
            ) : (
              children
            )}
            {suffix}
          </>
        ))}
      </Element>
    );
  }
);
Button.displayName = "Button";

type ButtonContextValue = VariantProps<typeof buttonStyles>;
const ButtonContext = React.createContext<ButtonContextValue>({});
const useButtonContext = () => {
  return React.useContext(ButtonContext);
};

export type { ButtonProps };
export { Button, buttonStyles, ButtonContext };
