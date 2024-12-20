"use client";

import * as React from "react";
import { type VariantProps } from "tailwind-variants";
import { Field, type FieldProps } from "@/registry/core/field-01";
import {
  InputRoot,
  TextAreaInput,
  type inputStyles,
} from "@/registry/core/input-01";
import {
  TextFieldRoot,
  type TextFieldRootProps,
} from "@/registry/core/text-field-01";

type TextAreaProps = TextFieldRootProps &
  Omit<FieldProps, "children"> &
  Omit<VariantProps<typeof inputStyles>, "size"> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    isLoading?: boolean;
    loaderPosition?: "prefix" | "suffix";
    placeholder?: string;
  };
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
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
      <TextFieldRoot className={className} {...props}>
        <Field
          label={label}
          description={description}
          errorMessage={errorMessage}
          isRequired={isRequired}
          necessityIndicator={necessityIndicator}
          contextualHelp={contextualHelp}
        >
          <InputRoot
            prefix={prefix}
            suffix={suffix}
            isLoading={isLoading}
            loaderPosition={loaderPosition}
            multiline
          >
            <TextAreaInput ref={ref} placeholder={placeholder} />
          </InputRoot>
        </Field>
      </TextFieldRoot>
    );
  }
);
TextArea.displayName = "TextArea";

export type { TextAreaProps };
export { TextArea };
