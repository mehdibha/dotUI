"use client";

import * as React from "react";
import { type VariantProps } from "tailwind-variants";
import { Field, type FieldProps } from "./field";
import { InputWrapper, TextAreaInput, inputStyles } from "./input";
import { TextFieldRoot, TextFieldRootProps } from "./text-field";

type TextAreaProps = TextFieldRootProps &
  Omit<FieldProps, "children"> &
  VariantProps<typeof inputStyles> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    loading?: boolean;
    loaderPosition?: "prefix" | "suffix";
    placeholder?: string;
  };
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant,
      size,
      placeholder,
      label,
      description,
      errorMessage,
      prefix,
      suffix,
      loading,
      loaderPosition = "suffix",
      ...props
    },
    ref
  ) => {
    return (
      <TextFieldRoot className={className} {...props}>
        <Field label={label} description={description} errorMessage={errorMessage}>
          <InputWrapper
            size={size}
            variant={variant}
            prefix={prefix}
            suffix={suffix}
            loading={loading}
            loaderPosition={loaderPosition}
            multiline
          >
            <TextAreaInput ref={ref} placeholder={placeholder} />
          </InputWrapper>
        </Field>
      </TextFieldRoot>
    );
  }
);
TextArea.displayName = "TextArea";

export type { TextAreaProps };
export { TextArea };
