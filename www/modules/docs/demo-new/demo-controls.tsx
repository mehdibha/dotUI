"use client";

import type React from "react";
import type { Key } from "react-aria-components";

import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";
import { Input } from "@dotui/registry/ui/input";

import { useDemoContext } from "./demo.client";
import type { ControlValue, NormalizedDemoControl } from "./types";

export const DemoControls = () => {
  const { controlList, controlValues, hasControls, handleValueChange } =
    useDemoContext();

  if (!hasControls) {
    return null;
  }

  return (
    <div className="w-72 border-border border-l bg-bg-subtle px-4 py-5">
      <p className="mb-4 font-semibold text-fg-muted text-xs uppercase tracking-wide">
        Controls
      </p>
      <div className="space-y-4">
        {controlList.map((control) => (
          <ControlField
            key={control.name}
            control={control}
            value={controlValues[control.name]}
            onValueChange={handleValueChange}
          />
        ))}
      </div>
    </div>
  );
};

interface ControlFieldProps {
  control: NormalizedDemoControl;
  value: ControlValue;
  onValueChange: (name: string, value: ControlValue) => void;
}

const ControlField = ({
  control,
  value,
  onValueChange,
}: ControlFieldProps) => {
  switch (control.type) {
    case "boolean":
      return (
        <Switch
          isSelected={Boolean(value)}
          onChange={(isSelected) => onValueChange(control.name, isSelected)}
        >
          <SwitchIndicator />
          <Label className="capitalize">
            {control.label ?? formatControlName(control.name)}
          </Label>
        </Switch>
      );
    case "select": {
      const options = control.options;
      const selectedValue =
        (typeof value === "string" && value.length > 0
          ? value
          : (control.defaultValue as string | undefined)) ??
        options[0]?.value ??
        "";

      return (
        <div className="space-y-1.5">
          <FieldLabel control={control} />
          <Select
            aria-label={control.label ?? control.name}
            value={selectedValue as Key}
            onChange={(key) => onValueChange(control.name, key?.toString() ?? "")}
          >
            <SelectTrigger />
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} id={option.value}>
                  {option.label ?? option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    case "number": {
      const numericValue =
        typeof value === "number"
          ? value
          : (control.defaultValue as number | undefined);
      return (
        <div className="space-y-1.5">
          <FieldLabel control={control} />
          <Input
            type="number"
            value={
              typeof numericValue === "number" ? String(numericValue) : ""
            }
            min={control.min}
            max={control.max}
            step={control.step}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const nextValue = event.target.value;
              onValueChange(
                control.name,
                nextValue === "" ? undefined : Number(nextValue),
              );
            }}
          />
        </div>
      );
    }
    case "string":
    case "slots": {
      const textValue =
        typeof value === "string"
          ? value
          : (control.defaultValue as string | undefined) ?? "";
      return (
        <div className="space-y-1.5">
          <FieldLabel control={control} />
          <Input
            placeholder={control.type === "string" ? control.placeholder : undefined}
            value={textValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onValueChange(control.name, event.target.value)
            }
          />
        </div>
      );
    }
    default:
      return null;
  }
};

const FieldLabel = ({ control }: { control: NormalizedDemoControl }) => (
  <Label className="font-semibold text-fg-muted text-xs uppercase tracking-wide">
    {control.label ?? formatControlName(control.name)}
  </Label>
);

const formatControlName = (name: string) =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
