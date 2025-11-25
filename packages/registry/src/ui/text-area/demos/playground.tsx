"use client";

import type { Control } from "@dotui/registry/playground";
import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

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
    label: "Label",
    defaultValue: "Description",
  },
  {
    type: "string",
    name: "placeholder",
    label: "Placeholder",
    defaultValue: "Enter description...",
  },
  {
    type: "string",
    name: "description",
    label: "Description",
    defaultValue: "",
  },
  {
    type: "string",
    name: "errorMessage",
    label: "Error Message",
    defaultValue: "",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    label: "Read Only",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    label: "Invalid",
    defaultValue: false,
  },
];

