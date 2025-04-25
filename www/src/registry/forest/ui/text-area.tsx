"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import {
  Label,
  HelpText,
  type FieldProps,
} from "@/registry/forest/ui/field_basic";
import {
  InputRoot,
  TextAreaInput,
  type InputRootProps,
} from "@/registry/forest/ui/input_basic";

const textAreaStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface TextAreaProps
  extends TextAreaRootProps,
    Pick<InputRootProps, "prefix" | "suffix">,
    FieldProps {}

const TextArea = ({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  ...props
}: TextAreaProps) => {
  return (
    <TextAreaRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputRoot prefix={prefix} suffix={suffix} multiline>
        <TextAreaInput />
      </InputRoot>
      <HelpText description={description} errorMessage={errorMessage} />
    </TextAreaRoot>
  );
};

interface TextAreaRootProps extends React.ComponentProps<typeof AriaTextField> {
  placeholder?: string;
}
const TextAreaRoot = ({ className, ...props }: TextAreaRootProps) => {
  return (
    <AriaTextField
      className={composeRenderProps(className, (className) =>
        textAreaStyles({ className })
      )}
      {...props}
    />
  );
};

export type { TextAreaProps, TextAreaRootProps };
export { TextArea, TextAreaRoot };
