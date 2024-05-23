"use client";

import * as React from "react";
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  Provider,
  DateSegment,
  DateFieldContext as AriaDateFieldContext,
  type DateFieldProps as AriaDateFieldProps,
  type DateInputProps as AriaDateInputProps,
  type DateValue,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Field, type FieldProps } from "./field";
import {
  TextFieldContext,
  TextFieldInnerVisual,
  TextFieldInnerWrapper,
  textFieldVariants,
  useTextFieldContext,
} from "./text-field";

const dateFieldStyles = tv({ extend: textFieldVariants });

interface DateFieldProps<T extends DateValue>
  extends DateFieldRootProps<T>,
    Omit<FieldProps, "children"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  loaderPosition?: "prefix" | "suffix";
}
const DateField = <T extends DateValue>({
  className,
  label,
  labelProps,
  description,
  descriptionProps,
  errorMessage,
  fieldErrorProps,
  loading,
  prefix,
  suffix,
  loaderPosition = "suffix",
  ...props
}: DateFieldProps<T>) => {
  const showPrefixLoading = loading && loaderPosition === "prefix";
  const showSuffixLoading = loading && loaderPosition === "suffix";
  return (
    <DateFieldRoot className={className} {...props}>
      <Field
        label={label}
        labelProps={labelProps}
        description={description}
        descriptionProps={descriptionProps}
        errorMessage={errorMessage}
        fieldErrorProps={fieldErrorProps}
      >
        <DateFieldInnerWrapper>
          <DateFieldInnerVisual loading={showPrefixLoading}>
            {prefix}
          </DateFieldInnerVisual>
          <DateFieldInput className="flex items-center space-x-0.5">
            {(segment) => (
              <DateSegment
                className={
                  "rounded px-0.5 outline-none focus:bg-border-focus focus:text-black focus:caret-transparent"
                }
                segment={segment}
              />
            )}
          </DateFieldInput>
          <DateFieldInnerVisual loading={showSuffixLoading}>
            {suffix}
          </DateFieldInnerVisual>
        </DateFieldInnerWrapper>
      </Field>
    </DateFieldRoot>
  );
};
DateField.displayName = "DateField";

interface DateFieldRootProps<T extends DateValue>
  extends Omit<AriaDateFieldProps<T>, "className">,
    VariantProps<typeof dateFieldStyles> {
  className?: string;
}
const DateFieldRoot = <T extends DateValue>({
  className,
  size,
  type,
  ...props
}: DateFieldRootProps<T>) => {
  const { root } = dateFieldStyles({ size, type });
  return (
    <Provider values={[[DateFieldContext, { size, type }]]}>
      <AriaDateField className={root({ className })} {...props} />
    </Provider>
  );
};
DateFieldRoot.displayName = "DateFieldRoot";

// const DateFieldBase = React.forwardRef((props,ref) => {})

interface DateFieldInputProps extends Omit<AriaDateInputProps, "className"> {
  className?: string;
}
const DateFieldInput = React.forwardRef<
  React.ElementRef<typeof AriaDateInput>,
  DateFieldInputProps
>(
  (
    { className, ...props }: DateFieldInputProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { size, type } = useDateFieldContext();
    const { input } = dateFieldStyles({ size, type });
    return <AriaDateInput ref={ref} className={input({ className })} {...props} />;
  }
);
DateFieldInput.displayName = "DateFieldRoot";

const DateFieldInnerWrapper = TextFieldInnerWrapper;

const DateFieldInnerVisual = TextFieldInnerVisual;

const DateFieldContext = TextFieldContext;
const useDateFieldContext = useTextFieldContext;

export { DateField, DateFieldInnerWrapper };
