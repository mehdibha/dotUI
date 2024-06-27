"use client";

import * as React from "react";
import {
  ColorField as AriaColorField,
  type ColorFieldProps as AriaColorFieldProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { fieldStyles } from "./field";
import { Field, type FieldProps } from "./field";
import { InputRoot, Input, type inputStyles } from "./input";

type ColorFieldProps = ColorFieldRootProps &
  Omit<FieldProps, "children"> &
  VariantProps<typeof inputStyles> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    isLoading?: boolean;
    loaderPosition?: "prefix" | "suffix";
    placeholder?: string;
  };
const ColorField = React.forwardRef<HTMLInputElement, ColorFieldProps>(
  (
    {
      className,
      size,
      placeholder,
      label,
      description,
      errorMessage,
      prefix,
      suffix,
      isLoading,
      loaderPosition = "suffix",
      isRequired,
      necessityIndicator,
      contextualHelp,
      ...props
    },
    ref
  ) => {
    return (
      <ColorFieldRoot className={className} isRequired={isRequired} {...props}>
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
            prefix={prefix}
            suffix={suffix}
            isLoading={isLoading}
            loaderPosition={loaderPosition}
          >
            <Input ref={ref} placeholder={placeholder} />
          </InputRoot>
        </Field>
      </ColorFieldRoot>
    );
  }
);
ColorField.displayName = "ColorField";

type ColorFieldRootProps = Omit<AriaColorFieldProps, "className"> & {
  className?: string;
};
const ColorFieldRoot = React.forwardRef<
  React.ElementRef<typeof AriaColorField>,
  ColorFieldRootProps
>(({ className, ...props }, ref) => {
  const { root } = fieldStyles();
  return <AriaColorField ref={ref} className={root({ className })} {...props} />;
});
ColorFieldRoot.displayName = "ColorFieldRoot";

export type { ColorFieldProps, ColorFieldRootProps };
export { ColorField, ColorFieldRoot };
