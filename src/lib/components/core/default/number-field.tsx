"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from "lucide-react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button, ButtonProps } from "./button";
import { fieldStyles } from "./field";
import { Field, type FieldProps } from "./field";
import { InputWrapper, Input, inputStyles } from "./input";

type NumberFieldProps = NumberFieldRootProps &
  Omit<FieldProps, "children"> &
  VariantProps<typeof inputStyles> & {
    placeholder?: string;
  };
const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      className,
      variant,
      size,
      placeholder,
      label,
      description,
      errorMessage,
      isRequired,
      necessityIndicator,
      contextualHelp,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const prefix = isMobile ? (
      <NumberFieldButton slot="decrement" className="h-full rounded-none" />
    ) : undefined;
    const suffix = isMobile ? (
      <NumberFieldButton slot="increment" className="h-full rounded-none" />
    ) : (
      <div className="flex h-full flex-col">
        <NumberFieldButton
          slot="increment"
          iconType="chevron"
          className="h-auto flex-1 shrink rounded-none"
        />
        <NumberFieldButton
          slot="decrement"
          iconType="chevron"
          className="h-auto flex-1 shrink rounded-none"
        />
      </div>
    );
    return (
      <NumberFieldRoot className={className} {...props}>
        <Field
          label={label}
          description={description}
          errorMessage={errorMessage}
          isRequired={isRequired}
          necessityIndicator={necessityIndicator}
          contextualHelp={contextualHelp}
        >
          <InputWrapper size={size} variant={variant}>
            {prefix}
            <Input ref={ref} placeholder={placeholder} />
            {suffix}
          </InputWrapper>
        </Field>
      </NumberFieldRoot>
    );
  }
);
NumberField.displayName = "NumberField";

type NumberFieldRootProps = Omit<AriaNumberFieldProps, "className"> & {
  className?: string;
};
const NumberFieldRoot = React.forwardRef<
  React.ElementRef<typeof AriaNumberField>,
  NumberFieldRootProps
>(({ className, ...props }, ref) => {
  const { root } = fieldStyles();
  return <AriaNumberField ref={ref} className={root({ className })} {...props} />;
});
NumberFieldRoot.displayName = "NumberFieldRoot";

interface NumberFieldButtonProps extends ButtonProps {
  slot: "increment" | "decrement";
  iconType?: "chevron" | "default";
}
const NumberFieldButton = ({
  slot,
  iconType = "default",
  ...props
}: NumberFieldButtonProps) => {
  const icon =
    iconType === "chevron" ? (
      slot === "increment" ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      )
    ) : slot === "increment" ? (
      <PlusIcon />
    ) : (
      <MinusIcon />
    );
  return (
    <Button slot={slot} size="sm" shape="square" {...props}>
      {icon}
    </Button>
  );
};

export type { NumberFieldProps, NumberFieldRootProps };
export { NumberField, NumberFieldRoot, NumberFieldButton };
