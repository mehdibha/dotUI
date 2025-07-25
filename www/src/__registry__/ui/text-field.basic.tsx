"use client";

import type { FieldProps } from "@/registry/ui/field.basic";
import type { InputRootProps } from "@/registry/ui/input.basic";
import * as React from "react";
import { HelpText, Label } from "@/registry/ui/field.basic";
import { Input, InputRoot } from "@/registry/ui/input.basic";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const textFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface TextFieldProps
  extends TextFieldRootProps,
    Pick<InputRootProps, "size" | "prefix" | "suffix">,
    FieldProps {
  inputRef?: React.RefObject<HTMLInputElement>;
}

const TextField = ({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  size,
  inputRef,
  ...props
}: TextFieldProps) => {
  return (
    <TextFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <TextFieldInput
        inputRef={inputRef}
        size={size}
        prefix={prefix}
        suffix={suffix}
      />
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
        textFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

interface TextFieldInputProps extends InputRootProps {
  inputRef?: React.RefObject<HTMLInputElement>;
}
const TextFieldInput = ({ inputRef, ...props }: TextFieldInputProps) => {
  return (
    <InputRoot {...props}>
      <Input ref={inputRef} />
    </InputRoot>
  );
};

export type { TextFieldProps, TextFieldRootProps, TextFieldInputProps };
export { TextField, TextFieldRoot, TextFieldInput };
