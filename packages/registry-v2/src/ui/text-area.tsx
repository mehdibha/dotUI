"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { HelpText, Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";
import type { FieldProps } from "@dotui/registry-v2/ui/field";

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
      <Input.Group>
        {prefix && <Input.Addon>{prefix}</Input.Addon>}
        <Input.TextArea />
        {suffix && <Input.Addon>{suffix}</Input.Addon>}
      </Input.Group>
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
      data-slot="text-area"
      className={composeRenderProps(className, (className) =>
        textAreaStyles({ className }),
      )}
      {...props}
    />
  );
};

export type { TextAreaProps, TextAreaRootProps };
export { TextArea, TextAreaRoot };
