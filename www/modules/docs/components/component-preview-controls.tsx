"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";

type ControlValue = string | number | boolean | null | undefined;

interface ComponentPreviewControlOption {
  label?: string;
  value: string;
}

interface ComponentPreviewControl {
  name: string;
  type: string;
  defaultValue?: ControlValue;
  label?: string;
  options?: ComponentPreviewControlOption[];
  placeholder?: string;
}

const DEFAULT_SELECT_OPTIONS: Record<string, ComponentPreviewControlOption[]> =
  {
    variant: [
      { value: "primary", label: "Primary" },
      { value: "secondary", label: "Secondary" },
      { value: "quiet", label: "Quiet" },
      { value: "link", label: "Link" },
      { value: "danger", label: "Danger" },
      { value: "success", label: "Success" },
      { value: "warning", label: "Warning" },
      { value: "info", label: "Info" },
    ],
  };

const buildControlDefaults = (controls?: ComponentPreviewControl[]) => {
  if (!controls?.length) {
    return {};
  }

  return controls.reduce<Record<string, ControlValue>>((acc, control) => {
    acc[control.name] = getControlDefaultValue(control);
    return acc;
  }, {});
};

const getControlDefaultValue = (
  control: ComponentPreviewControl,
): ControlValue => {
  if (control.type === "boolean") {
    if (typeof control.defaultValue === "boolean") {
      return control.defaultValue;
    }
    return false;
  }

  if (control.type === "select") {
    if (typeof control.defaultValue !== "undefined") {
      return control.defaultValue;
    }

    const options = getSelectOptions(control);
    return options[0]?.value ?? "";
  }

  if (typeof control.defaultValue !== "undefined") {
    return control.defaultValue;
  }

  return "";
};

const getSelectOptions = (control: ComponentPreviewControl) => {
  if (control.options?.length) {
    return control.options;
  }

  const normalizedName = control.name.toLowerCase();
  return DEFAULT_SELECT_OPTIONS[normalizedName] ?? [];
};

const toTitleCase = (value: string) => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatControlLabel = (control: ComponentPreviewControl) => {
  if (control.label) {
    return control.label;
  }

  return toTitleCase(control.name);
};

const formatOptionLabel = (option: ComponentPreviewControlOption) => {
  if (option.label) {
    return option.label;
  }

  return toTitleCase(option.value);
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
        const label = formatControlLabel(control);
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
                  : (options[0]?.value ?? "");

          return (
            <Select
              key={control.name}
              aria-label={label}
              selectedKey={selectedKey}
              onSelectionChange={(selected) =>
                onValueChange(
                  control.name,
                  selected != null
                    ? selected.toString()
                    : (options[0]?.value ?? ""),
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
                  <SelectItem id={option.value} key={option.value}>
                    {formatOptionLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return (
          <div key={control.name} className="space-y-1">
            <Label htmlFor={controlId} className="text-xs">
              {label}
            </Label>
            <Input
              id={controlId}
              size="sm"
              value={
                typeof value === "number"
                  ? value.toString()
                  : typeof value === "string"
                    ? value
                    : ""
              }
              placeholder={control.placeholder}
              onChange={(event) =>
                onValueChange(control.name, event.target.value)
              }
              className="h-8 text-xs"
            />
          </div>
        );
      })}
    </div>
  );
};

export type {
  ComponentPreviewControl,
  ComponentPreviewControlOption,
  ComponentPreviewControlsProps,
  ControlValue,
};

export {
  ComponentPreviewControls,
  buildControlDefaults,
  getControlDefaultValue,
};
