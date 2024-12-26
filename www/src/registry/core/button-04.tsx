"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { chain } from "react-aria";
import {
  composeRenderProps,
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
  PressEvent,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Ripple } from "@/registry/core/ripple";
import { useRipple } from "@/registry/hooks/use-ripple";
import { focusRing } from "@/registry/lib/focus-styles";

const buttonStyles = tv(
  {
    extend: focusRing,
    base: "disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:bg-bg-disabled pending:text-fg-disabled pending:border pending:border-border-disabled relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium leading-normal transition-colors disabled:cursor-default",
    variants: {
      variant: {
        default:
          "bg-bg-neutral hover:bg-bg-neutral-hover text-fg-onNeutral",
        primary:
          "bg-bg-primary hover:bg-bg-primary-hover text-fg-onPrimary",
        quiet:
          "hover:bg-bg-inverse/10 text-fg bg-transparent",
        outline:
          "border-border-field hover:bg-bg-inverse/10 text-fg disabled:border-border-disabled border disabled:bg-transparent",
        accent:
          "bg-bg-accent hover:bg-bg-accent-hover text-fg-onAccent",
        success:
          "bg-bg-success hover:bg-bg-success-hover text-fg-onSuccess",
        warning:
          "bg-bg-warning hover:bg-bg-warning-hover text-fg-onWarning",
        danger:
          "bg-bg-danger hover:bg-bg-danger-hover text-fg-onDanger",
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
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = React.forwardRef(
  (localProps: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const contextProps = useButtonContext();
    const props = { ...contextProps, ...localProps };

    const { className, variant, size, shape, prefix, suffix, ...restProps } =
      props;

    const {
      onPress: onRipplePressHandler,
      onClear: onClearRipple,
      ripples,
    } = useRipple();

    const Element: React.ElementType = props.href ? AriaLink : AriaButton;

    const handlePress = React.useCallback(
      (e: PressEvent) => {
        // if (disableRipple || isDisabled || disableAnimation) return;
         onRipplePressHandler(e);
        // domRef.current && onRipplePressHandler(e);
      },
      [onRipplePressHandler],
    );

    return (
      <Element
        ref={ref}
        {...restProps}
        className={buttonStyles({ variant, size, shape, className })}
        onPress={chain(props.onPress, handlePress)}
      >
        {composeRenderProps(props.children, (children, { isPending }) => (
          <>
            <Ripple ripples={ripples} onClear={onClearRipple} />
            {isPending && (
              <Loader2Icon aria-label="loading" className="animate-spin" />
            )}
            {prefix}
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
