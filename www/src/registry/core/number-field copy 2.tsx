"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Button, type ButtonProps } from "@/registry/core/button-01";
import { Field, type FieldProps } from "@/registry/core/field";
import { InputRoot, Input, type inputStyles } from "@/registry/core/input";
import { useMediaQuery } from "@/registry/hooks/use-media-query";

const numberFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

type NumberFieldProps = NumberFieldRootProps &
  Omit<FieldProps, "children"> &
  VariantProps<typeof inputStyles> & {
    placeholder?: string;
  };
const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      className,
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
      <NumberFieldButton
        slot="decrement"
        className="h-full rounded-none rounded-l-md border-r"
      />
    ) : null;
    const suffix = isMobile ? (
      <NumberFieldButton
        slot="increment"
        className="h-full rounded-none rounded-r-md border-l"
      />
    ) : (
      <div className="flex h-full flex-col rounded-r-md">
        <NumberFieldButton
          slot="increment"
          iconType="chevron"
          className="h-auto flex-1 shrink rounded-none rounded-tr-md border-b border-l"
        />
        <NumberFieldButton
          slot="decrement"
          iconType="chevron"
          className="h-auto flex-1 shrink rounded-none rounded-br-md border-l"
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
          <InputRoot
            size={size}
            className="invalid:[&_button]:border-border-danger invalid:focus-within:[&_button]:border-border px-0"
          >
            {prefix}
            <Input ref={ref} placeholder={placeholder} className="px-2" />
            {suffix}
          </InputRoot>
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
  return (
    <AriaNumberField
      ref={ref}
      className={numberFieldStyles({ className })}
      {...props}
    />
  );
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
    <Button slot={slot} size="sm" variant="quiet" shape="square" {...props}>
      {icon}
    </Button>
  );
};

export type { NumberFieldProps, NumberFieldRootProps };
export { NumberField, NumberFieldRoot, NumberFieldButton };
