"use client";

import * as React from "react";
import {
  ToggleButton as ToggleButton_,
  type ToggleButtonProps as ToggleButtonProps_,
  composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

//TODO: change color tokens

const toggleButtonVariants = tv(
  {
    extend: focusRing,
    base: "inline-flex items-center justify-center whitespace-nowrap rounded-md leading-normal text-sm font-medium ring-offset-background transition-colors disabled:cursor-not-allowed",
    variants: {
      variant: {
        ghost: "disabled:bg-bg-disabled disabled:text-fg-disabled",
        outline: "disabled:border-border-disabled disabled:text-fg-disabled",
      },
      type: {
        neutral:
          "text-fg border hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 selected:bg-bg-inverse selected:text-fg-inverse",
        primary:
          "text-fg-primary border border-border-primary hover:bg-bg-primary/10 pressed:bg-bg-primary/20 selected:bg-bg-primary selected:text-fg-onPrimary",
        success:
          "text-fg-success border border-border-success hover:bg-bg-success/10 pressed:bg-bg-success/20 selected:bg-bg-success selected:text-fg-onSuccess",
        warning:
          "text-fg-warning border border-border-warning hover:bg-bg-warning/10 pressed:bg-bg-warning/20 selected:bg-bg-warning selected:text-fg-onWarning",
        danger:
          "text-fg-danger border border-border-danger hover:bg-bg-danger/10 pressed:bg-bg-danger/20 selected:bg-bg-danger selected:text-fg-onDanger",
      },
      size: {
        sm: "h-8 px-3 [&_svg]:size-4",
        md: "h-9 px-4 [&_svg]:size-4",
        lg: "h-10 px-6 [&_svg]:size-5",
      },
      shape: {
        default: "",
        square: "",
        circle: "rounded-full",
      },
    },
    compoundVariants: [
      // sizes
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
      // variant ghost
      {
        variant: "ghost",
        type: ["neutral", "primary", "success", "warning", "danger"],
        className: "border-none",
      },
      // variant outline
      {
        variant: "ghost",
        type: ["neutral", "primary", "success", "warning", "danger"],
        className: "background-transparent",
      },
    ],
    defaultVariants: {
      type: "neutral",
      variant: "ghost",
      size: "md",
      shape: "square",
    },
  },
  {
    responsiveVariants: ["sm"],
  }
);

export interface ToggleButtonProps
  extends Omit<ToggleButtonProps_, "type">,
    VariantProps<typeof toggleButtonVariants> {
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

const ToggleButton = ({
  variant,
  size,
  type,
  htmlType,
  shape,
  ...props
}: ToggleButtonProps) => {
  return (
    <ToggleButton_
      {...props}
      type={htmlType}
      className={composeRenderProps(props.className, (className) =>
        toggleButtonVariants({
          variant,
          size,
          type,
          shape,
          className,
        })
      )}
    />
  );
};

export { ToggleButton, toggleButtonVariants };
