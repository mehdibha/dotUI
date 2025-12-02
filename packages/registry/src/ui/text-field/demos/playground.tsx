"use client";

import type { ReactNode } from "react";

import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import type { Control } from "@dotui/registry/playground";

import { TextField } from "../index";

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
    defaultValue: "Email",
  },
  {
    type: "string",
    name: "description",
    defaultValue: "",
    placeholder: "Helper text",
  },
  {
    type: "string",
    name: "errorMessage",
    defaultValue: "",
    placeholder: "Error text",
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
  {
    type: "icon",
    name: "startIcon",
  },
  {
    type: "icon",
    name: "endIcon",
  },
];
