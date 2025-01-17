"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Label, HelpText, type FieldProps } from "@/registry/core/field-01";
import {
  InputRoot,
  Input,
  type InputRootProps,
} from "@/registry/core/input_new";

const textFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface TextFieldProps
  extends TextFieldRootProps,
    Pick<InputRootProps, "size" | "prefix" | "suffix">,
    FieldProps {}

const TextField = ({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  size,
  ...props
}: TextFieldProps) => {
  return (
    <TextFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputRoot size={size} prefix={prefix} suffix={suffix}>
        <Input />
      </InputRoot>
      <HelpText description={description} errorMessage={errorMessage} />
    </TextFieldRoot>
  );
};

interface TextFieldRootProps
  extends React.ComponentProps<typeof AriaTextField> {
  placeholder?: string;
}
const TextFieldRoot = ({ className, ...props }: TextFieldRootProps) => {
  return (
    <AriaTextField
      className={composeRenderProps(className, (className) =>
        textFieldStyles({ className })
      )}
      {...props}
    />
  );
};

export type { TextFieldProps, TextFieldRootProps };
export { TextField, TextFieldRoot };
