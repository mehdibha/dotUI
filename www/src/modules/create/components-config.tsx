import { ChevronDownIcon, ChevronRightIcon, SlidersHorizontalIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";

import { COLOR_TOKENS } from "@/registry/base/tokens";
import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { registryUi } from "@/registry/ui/registry";
import { Select, SelectValue } from "@/registry/ui/select";

import type { ParamDef, RegistryItem, TokenType } from "@/registry/types";

/* ----------------------------- Data helpers ----------------------------- */

const allComponents = registryUi.filter((item) => item.group).sort((a, b) => a.name.localeCompare(b.name));

const componentMetaMap = new Map<string, RegistryItem>(registryUi.map((item) => [item.name, item]));

const allGroups = Array.from(
	new Set(registryUi.map((item) => item.group).filter((g): g is NonNullable<typeof g> => !!g)),
).sort((a, b) => a.localeCompare(b));

export const GROUP_IDS = new Set<string>(allGroups);

function toTitleCase(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function getComponentDisplayName(slug: string): string {
	return toTitleCase(slug);
}

export function getGroupDisplayName(slug: string): string {
	return toTitleCase(slug);
}

export function isGroupId(id: string): boolean {
	return GROUP_IDS.has(id);
}

function getComponentsInGroup(group: string): RegistryItem[] {
	return registryUi.filter((item) => item.group === group).sort((a, b) => a.name.localeCompare(b.name));
}

function paramCount(item: RegistryItem): number {
	return item.params ? Object.keys(item.params).length : 0;
}

/* ----------------------- Card (shared card style) ----------------------- */

const cardClass =
	"flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover";

/* ---------------------- All components flat view ---------------------- */

interface AllComponentsViewProps {
	onSelect: (componentName: string) => void;
}

export function AllComponentsView({ onSelect }: AllComponentsViewProps) {
	const visibleComponents = allComponents.filter((comp) => paramCount(comp) >= 1);
	return (
		<div className="mt-4 flex flex-col gap-3">
			{visibleComponents.map((comp) => {
				const count = paramCount(comp);
				return (
					<ButtonPrimitives.Button key={comp.name} onPress={() => onSelect(comp.name)} className={cardClass}>
						<div className="flex items-center justify-between">
							<span>{toTitleCase(comp.name)}</span>
							<ChevronRightIcon className="size-4 text-fg-muted" />
						</div>
						{count > 0 && (
							<div className="flex items-center gap-2 text-fg-muted/60 text-xs">
								<span className="flex items-center gap-1">
									<SlidersHorizontalIcon className="size-3" />
									{count} {count === 1 ? "param" : "params"}
								</span>
							</div>
						)}
					</ButtonPrimitives.Button>
				);
			})}
		</div>
	);
}

/* -------------------- Component detail view -------------------- */

const radiusOptions = [
	{ label: "None", value: "0" },
	{ label: "Small", value: "--radius-sm" },
	{ label: "Medium", value: "--radius-md" },
	{ label: "Large", value: "--radius-lg" },
	{ label: "Full", value: "--radius-full" },
];

const blurOptions = [
	{ label: "None", value: "0px" },
	{ label: "Extra Small", value: "--blur-xs" },
	{ label: "Small", value: "--blur-sm" },
	{ label: "Medium", value: "--blur-md" },
	{ label: "Large", value: "--blur-lg" },
	{ label: "Extra Large", value: "--blur-xl" },
];

const opacityOptions = [
	{ label: "20%", value: "20%" },
	{ label: "40%", value: "40%" },
	{ label: "60%", value: "60%" },
	{ label: "80%", value: "80%" },
];

const colorOptions = Object.entries(COLOR_TOKENS)
	.filter(([, token]) => token.categories?.includes("background"))
	.map(([name]) => ({
		label: toTitleCase(name.replace(/^color-/, "")),
		value: `--${name}`,
	}));

interface ComponentDetailViewProps {
	componentName: string;
	selectedParams?: Record<string, string>;
	onParamChange?: (paramName: string, value: string) => void;
}

export function ComponentDetailView({ componentName, selectedParams, onParamChange }: ComponentDetailViewProps) {
	const meta = componentMetaMap.get(componentName);
	if (!meta) {
		return <p className="text-fg-muted text-sm">Component not found.</p>;
	}

	const params = meta.params ? Object.entries(meta.params) : [];

	if (params.length === 0) {
		return <p className="text-fg-muted text-sm">No customization options available for this component.</p>;
	}

	return (
		<div className="mt-4 flex flex-col gap-5">
			{params.map(([paramName, def]) => (
				<ParamEditor
					key={paramName}
					paramName={paramName}
					def={def}
					selected={selectedParams?.[paramName]}
					onChange={(value) => onParamChange?.(paramName, value)}
				/>
			))}
		</div>
	);
}

interface ParamEditorProps {
	paramName: string;
	def: ParamDef;
	selected: string | undefined;
	onChange: (value: string) => void;
}

function ParamEditor({ paramName, def, selected, onChange }: ParamEditorProps) {
	if (def.kind === "enum") {
		return (
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">{toTitleCase(paramName)}</span>
				<Select selectedKey={selected ?? def.default} onSelectionChange={(key) => onChange(key as string)}>
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							{def.values.map((value) => (
								<ListBoxItem key={value} id={value}>
									{toTitleCase(value)}
								</ListBoxItem>
							))}
						</ListBox>
					</Popover>
				</Select>
				{def.description && <p className="text-fg-muted/60 text-xs">{def.description}</p>}
			</div>
		);
	}

	const optionsByType = {
		blur: blurOptions,
		color: colorOptions,
		"font-size": [],
		opacity: opacityOptions,
		radius: radiusOptions,
		spacing: [],
	} satisfies Record<TokenType, { label: string; value: string }[]>;
	const options = optionsByType[def.type];

	return (
		<div className="flex flex-col gap-2">
			<span className="font-medium text-fg-muted text-xs">{toTitleCase(paramName)}</span>
			<Select selectedKey={selected ?? def.default} onSelectionChange={(key) => onChange(key as string)}>
				<Button size="sm" className="w-full">
					<SelectValue />
					<ChevronDownIcon />
				</Button>
				<Popover>
					<ListBox>
						{options.map((opt) => (
							<ListBoxItem key={opt.value} id={opt.value}>
								{opt.label}
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>
			{def.description && <p className="text-fg-muted/60 text-xs">{def.description}</p>}
		</div>
	);
}

/* ---------------------- Grouped components flat view ---------------------- */

interface GroupedComponentsViewProps {
	onSelect: (groupName: string) => void;
}

export function GroupedComponentsView({ onSelect }: GroupedComponentsViewProps) {
	return (
		<div className="mt-4 flex flex-col gap-3">
			{allGroups.map((group) => {
				const componentsInGroup = getComponentsInGroup(group);
				return (
					<ButtonPrimitives.Button key={group} onPress={() => onSelect(group)} className={cardClass}>
						<div className="flex items-center justify-between">
							<span>{toTitleCase(group)}</span>
							<ChevronRightIcon className="size-4 text-fg-muted" />
						</div>
						<div className="flex items-center gap-2 text-fg-muted/60 text-xs">
							<span>
								{componentsInGroup.length} {componentsInGroup.length === 1 ? "component" : "components"}
							</span>
						</div>
					</ButtonPrimitives.Button>
				);
			})}
		</div>
	);
}

/* -------------------- Group detail view -------------------- */

interface GroupDetailViewProps {
	groupName: string;
	onSelectComponent: (componentName: string) => void;
}

export function GroupDetailView({ groupName, onSelectComponent }: GroupDetailViewProps) {
	const componentsInGroup = getComponentsInGroup(groupName);

	if (componentsInGroup.length === 0) {
		return <p className="text-fg-muted text-sm">No components in this group.</p>;
	}

	return (
		<div className="mt-4 flex flex-col gap-3">
			<p className="text-fg-muted/80 text-xs">
				Components in this group share the same visual style. Pick a component below to configure it.
			</p>
			<div className="flex flex-col gap-2">
				{componentsInGroup.map((comp) => {
					const count = paramCount(comp);
					return (
						<ButtonPrimitives.Button key={comp.name} onPress={() => onSelectComponent(comp.name)} className={cardClass}>
							<div className="flex items-center justify-between">
								<span>{toTitleCase(comp.name)}</span>
								<ChevronRightIcon className="size-4 text-fg-muted" />
							</div>
							{count > 0 && <span className="text-fg-muted/60 text-xs">{count} params</span>}
						</ButtonPrimitives.Button>
					);
				})}
			</div>
		</div>
	);
}
