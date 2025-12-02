"use client";

import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  type LucideIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Field, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";
import { TextField } from "@dotui/registry/ui/text-field";
import type {
  BooleanControl,
  Control,
  ControlValues,
  EnumControl,
  IconControl,
  NumberControl,
  StringControl,
} from "@dotui/registry/playground";

/**
 * Available icons for the icon picker.
 * Maps icon name to the actual component.
 */
export const availableIcons: Record<string, LucideIcon> = {
  MailIcon,
  SearchIcon,
  UploadIcon,
  DownloadIcon,
  UserIcon,
  SettingsIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon,
  InfoIcon,
};

/**
 * Control components for the interactive demo.
 */

interface ControlRendererProps {
  control: Control;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

export function ControlRenderer({
  control,
  value,
  onChange,
}: ControlRendererProps) {
  switch (control.type) {
    case "boolean":
      return (
        <BooleanControlRenderer
          control={control}
          value={value as boolean}
          onChange={onChange}
        />
      );
    case "string":
      return (
        <StringControlRenderer
          control={control}
          value={value as string}
          onChange={onChange}
        />
      );
    case "number":
      return (
        <NumberControlRenderer
          control={control}
          value={value as number}
          onChange={onChange}
        />
      );
    case "enum":
      return (
        <EnumControlRenderer
          control={control}
          value={value as string}
          onChange={onChange}
        />
      );
    case "icon":
      return (
        <IconControlRenderer
          control={control}
          value={value as string | null}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

interface BooleanControlRendererProps {
  control: BooleanControl;
  value: boolean;
  onChange: (name: string, value: unknown) => void;
}

function BooleanControlRenderer({
  control,
  value,
  onChange,
}: BooleanControlRendererProps) {
  return (
    <Field>
      <div className="flex items-center gap-2">
        <Label>{control.name}</Label>
        <Button variant="quiet" className="size-6 *:[svg]:size-3">
          <InfoIcon />
        </Button>
      </div>
      <Switch
        isSelected={value}
        onChange={(selected) => onChange(control.name, selected)}
        size="sm"
      />
    </Field>
  );
}

interface StringControlRendererProps {
  control: StringControl;
  value: string;
  onChange: (name: string, value: unknown) => void;
}

function StringControlRenderer({
  control,
  value,
  onChange,
}: StringControlRendererProps) {
  return (
    <TextField
      value={value}
      onChange={(val) => onChange(control.name, val)}
      className="w-full"
    >
      <Label>{control.name}</Label>
      <Input placeholder={control.placeholder} size="sm" />
    </TextField>
  );
}

interface NumberControlRendererProps {
  control: NumberControl;
  value: number;
  onChange: (name: string, value: unknown) => void;
}

function NumberControlRenderer({
  control,
  value,
  onChange,
}: NumberControlRendererProps) {
  return (
    <TextField
      value={String(value)}
      onChange={(val) => onChange(control.name, Number(val) || 0)}
      className="w-full"
    >
      <Label>{control.name}</Label>
      <Input
        type="number"
        min={control.min}
        max={control.max}
        step={control.step}
        size="sm"
      />
    </TextField>
  );
}

interface EnumControlRendererProps {
  control: EnumControl;
  value: string;
  onChange: (name: string, value: unknown) => void;
}

function EnumControlRenderer({
  control,
  value,
  onChange,
}: EnumControlRendererProps) {
  return (
    <Select value={value} onChange={(key) => onChange(control.name, key)}>
      <Label>{control.name}</Label>
      <SelectTrigger size="sm" />
      <SelectContent>
        {control.options.map((option) => (
          <SelectItem key={option} id={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface IconControlRendererProps {
  control: IconControl;
  value: string | null;
  onChange: (name: string, value: unknown) => void;
}

function IconControlRenderer({
  control,
  value,
  onChange,
}: IconControlRendererProps) {
  const iconNames = Object.keys(availableIcons);

  return (
    <Select
      value={value || "__none__"}
      onSelectionChange={(key) =>
        onChange(control.name, key === "__none__" ? null : key)
      }
      className="w-full"
    >
      <Label>{control.name}</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="__none__" textValue="None">
          <span className="text-fg-muted">None</span>
        </SelectItem>
        {iconNames.map((iconName) => {
          const IconComponent = availableIcons[iconName];
          if (!IconComponent) return null;
          return (
            <SelectItem key={iconName} id={iconName} textValue={iconName}>
              <span className="flex items-center gap-2">
                <IconComponent className="size-4" />
                <span>{iconName.replace("Icon", "")}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

interface ControlsProps {
  controls: Control[];
  values: ControlValues;
  onChange: (name: string, value: unknown) => void;
}

export function Controls({ controls, values, onChange }: ControlsProps) {
  return (
    <>
      {controls.map((control) => (
        <ControlRenderer
          key={control.name}
          control={control}
          value={values[control.name]}
          onChange={onChange}
        />
      ))}
    </>
  );
}
