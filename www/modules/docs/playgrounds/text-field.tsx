"use client";

import type { ReactNode } from "react";

import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

import type { Control } from "../interactive-demo/types";

/**
 * TextField playground component.
 * Renders a TextField with optional Label, Description, FieldError, and icons.
 */

interface TextFieldPlaygroundProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

// Add import path metadata for the code serializer
TextField.__importPath = "@dotui/registry/ui/text-field";
Label.__importPath = "@dotui/registry/ui/field";
Description.__importPath = "@dotui/registry/ui/field";
FieldError.__importPath = "@dotui/registry/ui/field";
Input.__importPath = "@dotui/registry/ui/input";
InputGroup.__importPath = "@dotui/registry/ui/input";
InputAddon.__importPath = "@dotui/registry/ui/input";

export function TextFieldPlayground({
  label,
  description,
  errorMessage,
  startIcon,
  endIcon,
  ...props
}: TextFieldPlaygroundProps) {
  const hasIcons = startIcon || endIcon;

  return (
    <TextField {...props}>
      {label && <Label>{label}</Label>}
      {hasIcons ? (
        <InputGroup>
          {startIcon && <InputAddon>{startIcon}</InputAddon>}
          <Input />
          {endIcon && <InputAddon>{endIcon}</InputAddon>}
        </InputGroup>
      ) : (
        <Input />
      )}
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  );
}

/**
 * Controls for the TextField playground.
 */
export const textFieldControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Email",
  },
  {
    type: "string",
    name: "description",
    label: "Description",
    defaultValue: "",
    placeholder: "Helper text",
  },
  {
    type: "string",
    name: "errorMessage",
    label: "Error Message",
    defaultValue: "",
    placeholder: "Error text",
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
  {
    type: "icon",
    name: "startIcon",
    label: "Start Icon",
  },
  {
    type: "icon",
    name: "endIcon",
    label: "End Icon",
  },
];

