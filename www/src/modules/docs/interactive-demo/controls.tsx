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
import * as ButtonPrimitives from "react-aria-components/Button";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Field, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { Switch } from "@/registry/ui/switch";
import { TextField } from "@/registry/ui/text-field";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

import type {
	ControlValues,
	SerializableBooleanControl,
	SerializableControl,
	SerializableEnumControl,
	SerializableIconControl,
	SerializableNumberControl,
	SerializablePropReference,
	SerializableStringControl,
} from "./types";

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

function ContextualHelp({ name, reference }: { name: string; reference?: SerializablePropReference }) {
	if (!reference) {
		return null;
	}

	return (
		<ButtonPrimitives.ButtonContext value={null}>
			<Dialog>
				<Button size="sm" variant="quiet" className="size-6 [&_svg]:size-3" aria-label={`Info about ${name}`}>
					<InfoIcon />
				</Button>
				<Popover placement="top" className="max-w-xs">
					<DialogContent className="gap-2">
						<h3 className="font-mono text-base font-medium">{name}</h3>

						{reference.description && <p className="text-sm text-fg-muted">{reference.description}</p>}

						<code
							className="font-mono text-[0.8125rem] **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
							// oxlint-disable-next-line react/no-danger -- highlighted type HTML is generated from local component metadata.
							dangerouslySetInnerHTML={{ __html: reference.typeHighlighted }}
						/>
					</DialogContent>
				</Popover>
			</Dialog>
		</ButtonPrimitives.ButtonContext>
	);
}

/**
 * Control components for the interactive demo.
 */

type ControlsLayout = "horizontal" | "vertical";

interface ControlRendererProps {
	control: SerializableControl;
	value: unknown;
	onChange: (name: string, value: unknown) => void;
	layout: ControlsLayout;
}

export function ControlRenderer({ control, value, onChange, layout }: ControlRendererProps) {
	switch (control.type) {
		case "boolean":
			return <BooleanControlRenderer control={control} value={value as boolean} onChange={onChange} layout={layout} />;
		case "string":
			return <StringControlRenderer control={control} value={value as string} onChange={onChange} />;
		case "number":
			return <NumberControlRenderer control={control} value={value as number} onChange={onChange} />;
		case "enum":
			return <EnumControlRenderer control={control} value={value as string} onChange={onChange} />;
		case "icon":
			return <IconControlRenderer control={control} value={value as string | null} onChange={onChange} />;
		default:
			return null;
	}
}

interface BooleanControlRendererProps {
	control: SerializableBooleanControl;
	value: boolean;
	onChange: (name: string, value: unknown) => void;
	layout: ControlsLayout;
}

/**
 * In the inline-column (horizontal) layout the switch sits on one row with its
 * label (label left, switch right); in the bottom-bar (vertical) layout it
 * stacks under the label like the other controls.
 */
function BooleanControlRenderer({ control, value, onChange, layout }: BooleanControlRendererProps) {
	const inline = layout === "horizontal";
	return (
		<Field
			orientation={inline ? "horizontal" : "vertical"}
			className={inline ? "items-center justify-between gap-2" : "w-auto"}
		>
			<div className="flex items-center gap-1">
				<Label>{control.name}</Label>
				<ContextualHelp name={control.name} reference={control.reference} />
			</div>
			<Switch
				aria-label={control.name}
				isSelected={value}
				onChange={(selected) => onChange(control.name, selected)}
				size="sm"
			/>
		</Field>
	);
}

interface StringControlRendererProps {
	control: SerializableStringControl;
	value: string;
	onChange: (name: string, value: unknown) => void;
}

function StringControlRenderer({ control, value, onChange }: StringControlRendererProps) {
	return (
		<TextField value={value} onChange={(val) => onChange(control.name, val)} className="w-full">
			<div className="flex items-center gap-1">
				<Label>{control.name}</Label>
				<ContextualHelp name={control.name} reference={control.reference} />
			</div>
			<Input placeholder={control.placeholder} size="sm" />
		</TextField>
	);
}

interface NumberControlRendererProps {
	control: SerializableNumberControl;
	value: number;
	onChange: (name: string, value: unknown) => void;
}

function NumberControlRenderer({ control, value, onChange }: NumberControlRendererProps) {
	return (
		<TextField value={String(value)} onChange={(val) => onChange(control.name, Number(val) || 0)} className="w-full">
			<div className="flex items-center gap-1">
				<Label>{control.name}</Label>
				<ContextualHelp name={control.name} reference={control.reference} />
			</div>
			<Input type="number" min={control.min} max={control.max} step={control.step} size="sm" />
		</TextField>
	);
}

interface EnumControlRendererProps {
	control: SerializableEnumControl;
	value: string;
	onChange: (name: string, value: unknown) => void;
}

/**
 * A small enum (few short options, e.g. `size`: sm/md/lg) renders as a segmented
 * control — quicker to scan and toggle than a dropdown, matching the playground
 * design. Larger option sets fall back to a Select to avoid overflow.
 */
function isSegmentedEnum(control: SerializableEnumControl): boolean {
	return (
		control.options.length > 1 && control.options.length <= 3 && control.options.every((option) => option.length <= 8)
	);
}

function EnumControlRenderer({ control, value, onChange }: EnumControlRendererProps) {
	if (isSegmentedEnum(control)) {
		return <SegmentedEnumControlRenderer control={control} value={value} onChange={onChange} />;
	}

	return (
		<Select selectedKey={value} onSelectionChange={(key) => onChange(control.name, key)} className="w-full">
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

function SegmentedEnumControlRenderer({ control, value, onChange }: EnumControlRendererProps) {
	return (
		<Field>
			<div className="flex items-center gap-1">
				<Label>{control.name}</Label>
				<ContextualHelp name={control.name} reference={control.reference} />
			</div>
			<ToggleButtonGroup
				aria-label={control.name}
				size="sm"
				selectionMode="single"
				disallowEmptySelection
				selectedKeys={value ? [value] : []}
				onSelectionChange={(keys) => {
					const next = keys.values().next().value;
					if (next != null) onChange(control.name, next);
				}}
				className="w-full"
			>
				{control.options.map((option) => (
					<ToggleButton key={option} id={option} className="flex-1">
						{option}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</Field>
	);
}

interface IconControlRendererProps {
	control: SerializableIconControl;
	value: string | null;
	onChange: (name: string, value: unknown) => void;
}

function IconControlRenderer({ control, value, onChange }: IconControlRendererProps) {
	const iconNames = Object.keys(availableIcons);

	return (
		<Select
			selectedKey={value || "__none__"}
			onSelectionChange={(key) => onChange(control.name, key === "__none__" ? null : key)}
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
	controls: SerializableControl[];
	values: ControlValues;
	onChange: (name: string, value: unknown) => void;
	layout: ControlsLayout;
}

export function Controls({ controls, values, onChange, layout }: ControlsProps) {
	return (
		<>
			{controls.map((control) => {
				// In the bottom-bar (vertical) layout controls sit in a row, so give text/select
				// controls a fixed width; booleans size to content. In the inline column they fill it.
				const wrapperWidth = layout === "vertical" ? (control.type === "boolean" ? "w-auto" : "w-44") : "w-full";
				return (
					<div key={control.name} className={cn("shrink-0", wrapperWidth)}>
						<ControlRenderer control={control} value={values[control.name]} onChange={onChange} layout={layout} />
					</div>
				);
			})}
		</>
	);
}
