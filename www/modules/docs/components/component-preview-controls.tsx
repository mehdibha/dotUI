"use client";

import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";

import {
  buildControlDefaults,
  type ComponentPreviewControl,
  type ControlValue,
  getControlDefaultValue,
} from "@/modules/docs/lib/component-controls";

const getSelectOptions = (control: ComponentPreviewControl) => {
  if (control.type !== "select") {
    return [];
  }

  return control.options;
};

const createControlId = (name: string) => {
  return `component-control-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
};

interface ComponentPreviewControlsProps {
  controls: ComponentPreviewControl[];
  values: Record<string, ControlValue>;
  onValueChange: (name: string, value: ControlValue) => void;
}

const ComponentPreviewControls = ({
  controls,
  values,
  onValueChange,
}: ComponentPreviewControlsProps) => {
  if (!controls.length) {
    return null;
  }

  return (
    <div className="-ml-2 min-w-48 space-y-3 rounded-tr-md border border-l-0 bg-card/50 p-3 pl-5 **:data-[slot=label]:text-xs">
      {controls.map((control) => {
        const label = control.name;
        const value = values[control.name] ?? getControlDefaultValue(control);
        const controlId = createControlId(control.name);

        if (control.type === "boolean") {
          return (
            <div
              key={control.name}
              className="flex items-center justify-between gap-2"
            >
              <Label htmlFor={controlId} className="text-xs">
                {label}
              </Label>
              <Switch
                id={controlId}
                size="sm"
                aria-label={label}
                isSelected={Boolean(value)}
                onChange={(isSelected) =>
                  onValueChange(control.name, isSelected)
                }
              />
            </div>
          );
        }

        if (control.type === "select") {
          const options = getSelectOptions(control);

          if (!options.length) {
            return null;
          }

          const selectedKey =
            typeof value === "string"
              ? value
              : typeof value === "number"
                ? value.toString()
                : typeof control.defaultValue === "string"
                  ? control.defaultValue
                  : (options[0] ?? "");

          return (
            <Select
              key={control.name}
              aria-label={label}
              selectedKey={selectedKey}
              onSelectionChange={(selected) =>
                onValueChange(
                  control.name,
                  selected != null ? selected.toString() : (options[0] ?? ""),
                )
              }
              className="w-full"
            >
              <Label>{label}</Label>
              <SelectTrigger
                size="sm"
                className="h-7 w-full border-0 text-xs"
              />
              <SelectContent>
                {options.map((option) => (
                  <SelectItem id={option} key={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        const exhaustiveCheck: never = control;
        void exhaustiveCheck;
        return null;
      })}
    </div>
  );
};

export type {
  ComponentPreviewControl,
  ComponentPreviewControlsProps,
  ControlValue,
};

export {
  ComponentPreviewControls,
  buildControlDefaults,
  getControlDefaultValue,
};
