import { ChevronDownIcon, ChevronRightIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button as AriaButton } from "react-aria-components";

import { registryUi } from "@/registry/ui/registry";
import type { RegistryItem } from "@/registry/types";
import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectValue } from "@/registry/ui/select";

/* ----------------------------- Data helpers ----------------------------- */

const allComponents = registryUi
	.filter((item) => item.group)
	.sort((a, b) => a.name.localeCompare(b.name));

const componentMetaMap = new Map<string, RegistryItem>(
	registryUi.map((item) => [item.name, item]),
);

function toTitleCase(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function getComponentDisplayName(slug: string): string {
	return toTitleCase(slug);
}

/* ----------------------- Card (shared card style) ----------------------- */

const cardClass =
	"flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover";

/* ---------------------- All components flat view ---------------------- */

interface AllComponentsViewProps {
	onSelect: (componentName: string) => void;
}

export function AllComponentsView({ onSelect }: AllComponentsViewProps) {
	return (
		<div className="mt-4 flex flex-col gap-3">
			{allComponents.map((comp) => {
				const styleCount = comp.styles ? Object.keys(comp.styles).length : 0;
				const paramCount = comp.params ? Object.keys(comp.params).length : 0;
				return (
					<AriaButton
						key={comp.name}
						onPress={() => onSelect(comp.name)}
						className={cardClass}
					>
						<div className="flex items-center justify-between">
							<span>{toTitleCase(comp.name)}</span>
							<ChevronRightIcon className="size-4 text-fg-muted" />
						</div>
						{(styleCount > 1 || paramCount > 0) && (
							<div className="flex items-center gap-2 text-xs text-fg-muted/60">
								{styleCount > 1 && (
									<span>{styleCount} styles</span>
								)}
								{paramCount > 0 && (
									<span className="flex items-center gap-1">
										<SlidersHorizontalIcon className="size-3" />
										{paramCount} {paramCount === 1 ? "param" : "params"}
									</span>
								)}
							</div>
						)}
					</AriaButton>
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
	selectedParams?: Record<string, string>;
	onParamChange?: (paramName: string, value: string) => void;
}

export function ComponentDetailView({
	componentName,
	selectedStyle,
	onStyleChange,
	selectedParams,
	onParamChange,
}: ComponentDetailViewProps) {
	const meta = componentMetaMap.get(componentName);
	if (!meta) {
		return <p className="text-sm text-fg-muted">Component not found.</p>;
	}

	const styles = meta.styles ? Object.keys(meta.styles) : [];
	const params = meta.params ? Object.entries(meta.params) : [];
	const hasConfig = styles.length > 0 || params.length > 0;
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
					{defaultStyleDescription && (
						<p className="text-xs text-fg-muted/60">{defaultStyleDescription}</p>
					)}
				</div>
			)}

			{/* Param editors */}
			{params.map(([paramName, paramDef]) => (
				<div key={paramName} className="flex flex-col gap-2">
					<span className="font-medium text-fg-muted text-xs">{formatParamName(paramName)}</span>
					{paramDef.type === "radius" && (
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

			{!hasConfig && (
				<p className="text-sm text-fg-muted">
					No customization options available for this component.
				</p>
			)}
		</div>
	);
}

function formatParamName(name: string): string {
	// "--badge-radius" → "Radius"
	return toTitleCase(
		name
			.replace(/^--/, "")
			.replace(/^[a-z]+-/, ""),
	);
}
