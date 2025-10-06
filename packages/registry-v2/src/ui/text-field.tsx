"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { HelpText, Label } from "@dotui/registry-v2/ui/field";
import { Input, InputRoot } from "@dotui/registry-v2/ui/input";
import type { FieldProps } from "@dotui/registry-v2/ui/field";
import type { InputRootProps } from "@dotui/registry-v2/ui/input";

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
