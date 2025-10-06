"use client";

import * as React from "react";
import {
  ColorField as AriaColorField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { HelpText, Label } from "@dotui/registry-v2/ui/field";
import { Input, InputRoot } from "@dotui/registry-v2/ui/input";
import type { FieldProps } from "@dotui/registry-v2/ui/field";
import type { InputRootProps } from "@dotui/registry-v2/ui/input";

const colorFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface ColorFieldProps
  extends ColorFieldRootProps,
    Pick<InputRootProps, "size" | "prefix" | "suffix">,
    FieldProps {
  inputRef?: React.RefObject<HTMLInputElement>;
}

const ColorField = ({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  size,
  inputRef,
  ...props
}: ColorFieldProps) => {
  return (
    <ColorFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <ColorFieldInput
        inputRef={inputRef}
        size={size}
        prefix={prefix}
        suffix={suffix}
      />
      <HelpText description={description} errorMessage={errorMessage} />
    </ColorFieldRoot>
  );
};

interface ColorFieldRootProps
  extends React.ComponentProps<typeof AriaColorField> {
  placeholder?: string;
}
const ColorFieldRoot = ({ className, ...props }: ColorFieldRootProps) => {
  return (
    <AriaColorField
      className={composeRenderProps(className, (className) =>
        colorFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

interface ColorFieldInputProps extends InputRootProps {
  inputRef?: React.RefObject<HTMLInputElement>;
}
const ColorFieldInput = ({ inputRef, ...props }: ColorFieldInputProps) => {
  return (
    <InputRoot {...props}>
      <Input ref={inputRef} />
    </InputRoot>
  );
};

export type { ColorFieldProps, ColorFieldRootProps, ColorFieldInputProps };
export { ColorField, ColorFieldRoot, ColorFieldInput };
