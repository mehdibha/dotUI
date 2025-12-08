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
import { ButtonContext } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Field, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Popover } from "@dotui/registry/ui/popover";
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
  PropReference,
  StringControl,
} from "@dotui/types/playground";

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

function ContextualHelp({
  name,
  reference,
}: {
  name: string;
  reference?: PropReference;
}) {
  if (!reference) {
    return null;
  }

  return (
    <ButtonContext value={null}>
      <Dialog>
        <Button
          size="sm"
          variant="quiet"
          className="size-6 [&_svg]:size-3"
          aria-label={`Info about ${name}`}
        >
          <InfoIcon />
        </Button>
        <Popover placement="top" className="max-w-xs">
          <DialogContent className="gap-2">
            <h3 className="font-medium font-mono text-base">{name}</h3>

            {reference.description && (
              <p className="text-fg-muted text-sm">{reference.description}</p>
            )}

            <div className="font-mono text-[0.8125rem]">{reference.type}</div>
          </DialogContent>
        </Popover>
      </Dialog>
    </ButtonContext>
  );
}

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

// interface StringWithIconsControlRendererProps {
//   control: StringWithIconsControl;
//   value: string;
//   onChange: (name: string, value: unknown) => void;
// }

// function StringWithIconsControlRenderer({
//   control,
//   value,
//   onChange,
// }: StringWithIconsControlRendererProps) {
//   return (
//     <TextField value={value} onChange={(val) => onChange(control.name, val)} className="w-full">
//       <ControlLabel name={control.name} reference={control.reference} />
//       <Input placeholder={control.placeholder} size="sm" />
//     </TextField>
//   );
// }

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
      <div className="flex items-center gap-1">
        <Label>{control.name}</Label>
        <ContextualHelp name={control.name} reference={control.reference} />
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
      <div className="flex items-center gap-1">
        <Label>{control.name}</Label>
        <ContextualHelp name={control.name} reference={control.reference} />
      </div>
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
      <div className="flex items-center gap-1">
        <Label>{control.name}</Label>
        <ContextualHelp name={control.name} reference={control.reference} />
      </div>
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
      <div className="flex items-center gap-1">
        <Label>{control.name}</Label>
        <ContextualHelp name={control.name} reference={control.reference} />
      </div>
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
      <div className="flex items-center gap-1">
        <Label>{control.name}</Label>
        <ContextualHelp name={control.name} reference={control.reference} />
      </div>
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
