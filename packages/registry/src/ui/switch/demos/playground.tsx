"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";

import { Switch, SwitchIndicator, SwitchThumb } from "../index";

interface SwitchPlaygroundProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function SwitchPlayground({
  label = "Airplane mode",
  ...props
}: SwitchPlaygroundProps) {
  return (
    <Switch {...props}>
      <SwitchIndicator>
        <SwitchThumb />
      </SwitchIndicator>
      <Label>{label}</Label>
    </Switch>
  );
}

export const switchControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Airplane mode",
  },
  {
    type: "enum",
    name: "size",
    label: "Size",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
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
];

