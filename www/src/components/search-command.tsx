import React from "react";
import {
	ArrowRightIcon,
	ChevronsUpDownIcon,
	CircleDashedIcon,
	CornerDownLeftIcon,
	FileTextIcon,
	SearchIcon,
} from "lucide-react";
import { composeRenderProps } from "react-aria-components";
import type * as PageTree from "fumadocs-core/page-tree";

import { Button } from "@dotui/registry/ui/button";
import { Command } from "@dotui/registry/ui/command";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Input, InputGroup } from "@dotui/registry/ui/input";
import { MenuContent, MenuItem, MenuSection, MenuSectionHeader } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import { SearchField } from "@dotui/registry/ui/search-field";

interface SearchCommandProps {
	items: PageTree.Node[];
	keyboardShortcut?: boolean;
	children: React.ReactNode;
	onAction?: () => void;
}

export function SearchCommand({ items, keyboardShortcut, children, onAction }: SearchCommandProps) {
	const [search, setSearch] = React.useState("");

	return (
		<SearchCommandDialog keyboardShortcut={keyboardShortcut} trigger={children}>
			<Command className="h-72">
				<SearchField autoFocus value={search} onChange={setSearch}>
					<InputGroup>
						<SearchIcon />
						<Input placeholder="Search" />
					</InputGroup>
				</SearchField>
				<MenuContent
					onAction={() => {
						setSearch("");
						onAction?.();
					}}
				>
					<MenuSection>
						<MenuSectionHeader>Menu</MenuSectionHeader>
						{(
							[
								{ label: "Docs", href: "/docs" },
								{ label: "Components", href: "/docs/components/button" },
							] as const
						).map((item) => (
							<MenuItem key={item.href} href={item.href} textValue={item.label}>
								<ArrowRightIcon className="text-fg-muted!" />
								{item.label}
							</MenuItem>
						))}
					</MenuSection>
					{items.map((group, index) => {
						if (group.type === "folder") {
							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: items is static navigation data
								<MenuSection key={index}>
									<MenuSectionHeader>{group.name}</MenuSectionHeader>
									{group.children.map((item) => {
										if (item.type === "page") {
											return (
												<MenuItem key={item.url} href={item.url} textValue={item.name as string}>
													{group.name === "Components" ? (
														<CircleDashedIcon className="text-fg-muted!" />
													) : (
														<FileTextIcon className="text-fg-muted!" />
													)}
													{item.name}
												</MenuItem>
											);
										}
										return null;
									})}
								</MenuSection>
							);
						}
						return null;
					})}
				</MenuContent>
				<div className="flex items-center justify-end gap-4 rounded-b-[inherit] border-t p-3 text-fg-muted text-xs [&_svg]:size-4">
					<div className="flex items-center gap-1">
						<ChevronsUpDownIcon />
						<span>Navigate</span>
					</div>
					<div className="flex items-center gap-1">
						<CornerDownLeftIcon />
						<span>Go</span>
					</div>
				</div>
			</Command>
		</SearchCommandDialog>
	);
}

function SearchCommandDialog({
	keyboardShortcut = false,
	trigger,
	children,
}: {
	keyboardShortcut?: boolean;
	trigger: React.ReactNode;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = React.useState(false);

	React.useEffect(() => {
		if (!keyboardShortcut) return;

		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				e.preventDefault();
				setIsOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [keyboardShortcut]);

	return (
		<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
			{trigger}
			<Overlay
				modalProps={{
					className: "duration-0 entering:scale-100 exiting:scale-100",
				}}
			>
				<DialogContent className="p-0!">
					{composeRenderProps(children, (children) => (
						<>
							{children}
							<Button
								slot="close"
								variant="default"
								size="sm"
								className="absolute top-2 right-2 h-7 px-2 font-normal text-xs"
							>
								Esc
							</Button>
						</>
					))}
				</DialogContent>
			</Overlay>
		</Dialog>
	);
}
