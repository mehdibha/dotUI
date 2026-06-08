import { getRouteApi } from "@tanstack/react-router";

import { ChevronsUpDownIcon, MoonIcon, SunIcon } from "lucide-react";

import { componentsData } from "@/modules/docs/components-list/components-data";
import { Button } from "@/registry/ui/button";
import { Command } from "@/registry/ui/command";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectValue } from "@/registry/ui/select";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import { GroupExamplesIndex } from "./__generated__/examples";
import { getGroupDisplayName } from "./components-config";

import type { PreviewMode } from "./preset";

const routeApi = getRouteApi("/_app/create");

const previewComponents = componentsData
	.flatMap((category) => category.components)
	.sort((a, b) => a.name.localeCompare(b.name));

// Whole-category previews (the preview route resolves these via GroupExamplesIndex).
// Skip any group slug that collides with a component slug so listbox keys stay unique.
const componentSlugs = new Set(previewComponents.map((comp) => comp.slug));
const previewGroups = Object.keys(GroupExamplesIndex)
	.filter((slug) => !componentSlugs.has(slug))
	.sort()
	.map((slug) => ({ slug, label: getGroupDisplayName(slug) }));

/**
 * Toolbar above the live preview. Owns "what am I looking at" (the component
 * picker) and "how am I looking at it" (light / dark) — deliberately separate
 * from the customizer panel on the left, which owns the design system itself.
 */
export function PreviewToolbar({
	previewMode,
	onTogglePreviewMode,
}: {
	previewMode: PreviewMode;
	onTogglePreviewMode: () => void;
}) {
	const { preview } = routeApi.useSearch();
	const navigate = routeApi.useNavigate();

	return (
		<div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
			<div className="flex items-center gap-2">
				<Select
					aria-label="Preview component"
					selectedKey={preview}
					onSelectionChange={(key) => navigate({ search: (prev) => ({ ...prev, preview: key as string }) })}
					className="w-56"
				>
					<Button size="sm" variant="quiet" className="w-full">
						<SelectValue className="truncate" />
						<ChevronsUpDownIcon data-icon-end="" />
					</Button>
					<Popover>
						<Command>
							<SearchField aria-label="Search components" autoFocus>
								<Input placeholder="Search components…" />
							</SearchField>
							<ListBox>
								<ListBoxSection>
									<ListBoxSectionHeader>Collections</ListBoxSectionHeader>
									{previewGroups.map((group) => (
										<ListBoxItem key={group.slug} id={group.slug} textValue={`All ${group.label}`}>
											<span className="truncate">All {group.label}</span>
										</ListBoxItem>
									))}
								</ListBoxSection>
								<ListBoxSection>
									<ListBoxSectionHeader>Components</ListBoxSectionHeader>
									{previewComponents.map((comp) => (
										<ListBoxItem key={comp.slug} id={comp.slug} textValue={comp.name}>
											<span className="truncate">{comp.name}</span>
										</ListBoxItem>
									))}
								</ListBoxSection>
							</ListBox>
						</Command>
					</Popover>
				</Select>
			</div>

			<Tooltip>
				<Button size="sm" isIconOnly variant="quiet" onPress={onTogglePreviewMode} aria-label="Toggle preview mode">
					{previewMode === "dark" ? <SunIcon /> : <MoonIcon />}
				</Button>
				<TooltipContent>{previewMode === "dark" ? "Light preview" : "Dark preview"}</TooltipContent>
			</Tooltip>
		</div>
	);
}
