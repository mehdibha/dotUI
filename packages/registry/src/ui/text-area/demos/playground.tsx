"use client";

import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";
import type { Control } from "@dotui/registry/playground";

interface TextAreaPlaygroundProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

export function TextAreaPlayground({
  label,
  description,
  errorMessage,
  placeholder = "Enter description...",
  ...props
}: TextAreaPlaygroundProps) {
  return (
    <TextField {...props}>
      {label && <Label>{label}</Label>}
      <TextArea placeholder={placeholder} />
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  );
}

export const textAreaControls: Control[] = [
  {
    type: "string",
    name: "label",
    defaultValue: "Description",
  },
  {
    type: "string",
    name: "placeholder",
    defaultValue: "Enter description...",
  },
  {
    type: "string",
    name: "description",
    defaultValue: "",
  },
  {
    type: "string",
    name: "errorMessage",
    defaultValue: "",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    defaultValue: false,
  },
];
