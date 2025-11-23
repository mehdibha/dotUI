"use client";

import type { Key } from "react-aria-components";

import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

import type { ControlValue, DemoControl } from "./controls";

interface DemoControlsPanelProps {
  controls: DemoControl[];
  values: Record<string, ControlValue>;
  onValueChange: (name: string, value: ControlValue) => void;
}

export const DemoControlsPanel = ({
  controls,
  values,
  onValueChange,
}: DemoControlsPanelProps) => {
  if (!controls.length) {
    return null;
  }

  return (
    <div className="w-64 border-border border-l bg-bg-subtle px-4 py-5">
      <p className="mb-4 font-semibold text-fg-muted text-xs uppercase tracking-wide">
        Controls
      </p>
      <div className="space-y-4">
        {controls.map((control) => (
          <ControlField
            key={control.name}
            control={control}
            value={values[control.name]}
            onValueChange={onValueChange}
          />
        ))}
      </div>
    </div>
  );
};

interface ControlFieldProps {
  control: DemoControl;
  value: ControlValue;
  onValueChange: (name: string, value: ControlValue) => void;
}

const ControlField = ({ control, value, onValueChange }: ControlFieldProps) => {
  if (control.type === "boolean") {
    return (
      <Switch
        isSelected={Boolean(value)}
        onChange={(isSelected) => onValueChange(control.name, isSelected)}
      >
        <SwitchIndicator />
        <Label className="capitalize">{formatControlName(control.name)}</Label>
      </Switch>
    );
  }

  if (control.type === "select") {
    const selectedValue =
      (typeof value === "string" && value.length > 0
        ? value
        : control.defaultValue) ??
      control.options[0] ??
      "";

    return (
      <div className="space-y-1.5">
        <Label className="font-semibold text-fg-muted text-xs uppercase tracking-wide">
          {formatControlName(control.name)}
        </Label>
        <Select
          aria-label={control.name}
          value={selectedValue as Key}
          onChange={(key) => onValueChange(control.name, key?.toString() ?? "")}
        >
          <SelectTrigger />
          <SelectContent>
            {control.options.map((option) => (
              <SelectItem key={option} id={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return null;
};

const formatControlName = (name: string) =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
