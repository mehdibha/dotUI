"use client";

import * as React from "react";
import {
  composeRenderProps,
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { ProgressBar } from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";
import { LoaderIcon } from "@/__icons__";

const buttonStyles = tv(
  {
    extend: focusRing,
    base: "disabled:bg-bg-disabled disabled:text-fg-disabled pending:cursor-default pending:bg-bg-disabled pending:text-fg-disabled inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium leading-normal transition-colors disabled:cursor-default",
    variants: {
      variant: {
        default:
          "bg-bg-neutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active text-fg-onNeutral",
        primary:
          "bg-bg-primary hover:bg-bg-primary-hover pressed:bg-bg-primary-active text-fg-onPrimary",
        quiet:
          "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg bg-transparent",
        outline:
          "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15 text-fg disabled:border-border-disabled border disabled:bg-transparent",
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
  extends Omit<React.ComponentProps<typeof AriaButton>, "className">,
    Omit<AriaLinkProps, "className" | "children" | "style">,
    VariantProps<typeof buttonStyles> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = (localProps: ButtonProps) => {
  const contextProps = useButtonContext();
  const props = { ...contextProps, ...localProps };

  const { className, variant, size, shape, prefix, suffix, ...restProps } =
    props;

  const Element: React.ElementType = props.href ? AriaLink : AriaButton;

  return (
    <Element
      className={buttonStyles({ variant, size, shape, className })}
      {...restProps}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {isPending ? (
            <MyProgressCircle aria-label="pending" />
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
};
Button.displayName = "Button";

type ButtonContextValue = VariantProps<typeof buttonStyles>;
const ButtonContext = React.createContext<ButtonContextValue>({});
const useButtonContext = () => {
  return React.useContext(ButtonContext);
};

export type { ButtonProps };
export { Button, buttonStyles, ButtonContext };

function MyProgressCircle(props: ProgressBarProps) {
  return (
    <ProgressBar {...props}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        style={{ display: "block" }}
      >
        <path
          fill="currentColor"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
        />
        <path
          fill="currentColor"
          d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.75s"
            values="0 12 12;360 12 12"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </ProgressBar>
  );
}
