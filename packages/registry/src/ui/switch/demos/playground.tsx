"use client";

import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

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
    defaultValue: "Airplane mode",
  },
  {
    type: "enum",
    name: "size",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
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
];
