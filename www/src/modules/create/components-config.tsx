import { ChevronDownIcon, ChevronRightIcon, SlidersHorizontalIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";

import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { registryUi } from "@/registry/ui/registry";
import { Select, SelectValue } from "@/registry/ui/select";
import type { RegistryItem } from "@/registry/types";

/* ----------------------------- Data helpers ----------------------------- */

const allComponents = registryUi.filter((item) => item.group).sort((a, b) => a.name.localeCompare(b.name));

const componentMetaMap = new Map<string, RegistryItem>(registryUi.map((item) => [item.name, item]));

// Derive the unique groups used across the registry (sorted alphabetically)
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

/* ----------------------- Card (shared card style) ----------------------- */

const cardClass =
	"flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover";

/* ---------------------- All components flat view ---------------------- */

interface AllComponentsViewProps {
	onSelect: (componentName: string) => void;
}

export function AllComponentsView({ onSelect }: AllComponentsViewProps) {
	const visibleComponents = allComponents.filter((comp) => {
		const styleCount = comp.styles ? Object.keys(comp.styles).length : 0;
		const tokenCount = comp.tokens ? Object.keys(comp.tokens).length : 0;
		const paramCount = comp.params ? Object.keys(comp.params).length : 0;
		return styleCount > 1 || tokenCount >= 1 || paramCount >= 1;
	});
	return (
		<div className="mt-4 flex flex-col gap-3">
			{visibleComponents.map((comp) => {
				const styleCount = comp.styles ? Object.keys(comp.styles).length : 0;
				const tokenCount = comp.tokens ? Object.keys(comp.tokens).length : 0;
				const paramCount = comp.params ? Object.keys(comp.params).length : 0;
				const customizableCount = tokenCount + paramCount;
				return (
					<ButtonPrimitives.Button key={comp.name} onPress={() => onSelect(comp.name)} className={cardClass}>
						<div className="flex items-center justify-between">
							<span>{toTitleCase(comp.name)}</span>
							<ChevronRightIcon className="size-4 text-fg-muted" />
						</div>
						{(styleCount > 1 || customizableCount > 0) && (
							<div className="flex items-center gap-2 text-fg-muted/60 text-xs">
								{styleCount > 1 && <span>{styleCount} styles</span>}
								{customizableCount > 0 && (
									<span className="flex items-center gap-1">
										<SlidersHorizontalIcon className="size-3" />
										{customizableCount} {customizableCount === 1 ? "param" : "params"}
									</span>
								)}
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

interface ComponentDetailViewProps {
	componentName: string;
	selectedStyle?: string;
	onStyleChange?: (componentName: string, style: string) => void;
	selectedTokens?: Record<string, string>;
	onTokenChange?: (tokenName: string, value: string) => void;
	selectedParams?: Record<string, string>;
	onParamChange?: (paramName: string, value: string) => void;
}

export function ComponentDetailView({
	componentName,
	selectedStyle,
	onStyleChange,
	selectedTokens,
	onTokenChange,
	selectedParams,
	onParamChange,
}: ComponentDetailViewProps) {
	const meta = componentMetaMap.get(componentName);
	if (!meta) {
		return <p className="text-fg-muted text-sm">Component not found.</p>;
	}

	const styles = meta.styles ? Object.keys(meta.styles) : [];
	const tokens = meta.tokens ? Object.entries(meta.tokens) : [];
	const params = meta.params ? Object.entries(meta.params) : [];
	const hasConfig = styles.length > 0 || tokens.length > 0 || params.length > 0;
	const defaultStyleDescription = meta.styles?.[meta.defaultStyle ?? ""]?.description;

	return (
		<div className="mt-4 flex flex-col gap-5">
			{/* Style selector */}
			{styles.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="font-medium text-fg-muted text-xs">Style</span>
					<Select
						selectedKey={selectedStyle ?? meta.defaultStyle ?? styles[0]}
						onSelectionChange={(key) => onStyleChange?.(componentName, key as string)}
					>
						<Button size="sm" className="w-full">
							<SelectValue />
							<ChevronDownIcon />
						</Button>
						<Popover>
							<ListBox>
								{styles.map((style) => (
									<ListBoxItem key={style} id={style}>
										{toTitleCase(style)}
									</ListBoxItem>
								))}
							</ListBox>
						</Popover>
					</Select>
					{defaultStyleDescription && <p className="text-fg-muted/60 text-xs">{defaultStyleDescription}</p>}
				</div>
			)}

			{/* Token editors (CSS variables) */}
			{tokens.map(([tokenName, tokenDef]) => (
				<div key={tokenName} className="flex flex-col gap-2">
					<span className="font-medium text-fg-muted text-xs">{formatTokenName(tokenName)}</span>
					{tokenDef.type === "radius" && (
						<Select
							selectedKey={selectedTokens?.[tokenName] ?? tokenDef.default}
							onSelectionChange={(key) => onTokenChange?.(tokenName, key as string)}
						>
							<Button size="sm" className="w-full">
								<SelectValue />
								<ChevronDownIcon />
							</Button>
							<Popover>
								<ListBox>
									{radiusOptions.map((opt) => (
										<ListBoxItem key={opt.value} id={opt.value}>
											{opt.label}
										</ListBoxItem>
									))}
								</ListBox>
							</Popover>
						</Select>
					)}
				</div>
			))}

			{/* Param editors (component-internal variants) */}
			{params.map(([paramName, paramDef]) => (
				<div key={paramName} className="flex flex-col gap-2">
					<span className="font-medium text-fg-muted text-xs">{toTitleCase(paramName)}</span>
					<Select
						selectedKey={selectedParams?.[paramName] ?? paramDef.default}
						onSelectionChange={(key) => onParamChange?.(paramName, key as string)}
					>
						<Button size="sm" className="w-full">
							<SelectValue />
							<ChevronDownIcon />
						</Button>
						<Popover>
							<ListBox>
								{paramDef.values.map((value) => (
									<ListBoxItem key={value} id={value}>
										{toTitleCase(value)}
									</ListBoxItem>
								))}
							</ListBox>
						</Popover>
					</Select>
					{paramDef.description && <p className="text-fg-muted/60 text-xs">{paramDef.description}</p>}
				</div>
			))}

			{!hasConfig && <p className="text-fg-muted text-sm">No customization options available for this component.</p>}
		</div>
	);
}

function formatTokenName(name: string): string {
	// "--badge-radius" → "Radius"
	return toTitleCase(name.replace(/^--/, "").replace(/^[a-z]+-/, ""));
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
					const styleCount = comp.styles ? Object.keys(comp.styles).length : 0;
					return (
						<ButtonPrimitives.Button key={comp.name} onPress={() => onSelectComponent(comp.name)} className={cardClass}>
							<div className="flex items-center justify-between">
								<span>{toTitleCase(comp.name)}</span>
								<ChevronRightIcon className="size-4 text-fg-muted" />
							</div>
							{styleCount > 1 && <span className="text-fg-muted/60 text-xs">{styleCount} styles</span>}
						</ButtonPrimitives.Button>
					);
				})}
			</div>
		</div>
	);
}
