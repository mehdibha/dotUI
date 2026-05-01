"use client";

import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Command } from "@/registry/ui/command";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectValue } from "@/registry/ui/select";

export default function Demo() {
	return (
		<Select placeholder="Select a country...">
			<Label>Country</Label>
			<Button>
				<SelectValue />
				<ChevronDownIcon className="ml-auto" />
			</Button>
			<Popover className="outline-hidden">
				<Command>
					<SearchField autoFocus>
						<InputGroup>
							<InputGroupAddon>
								<SearchIcon />
							</InputGroupAddon>
							<Input placeholder="Search..." />
							<InputGroupAddon>
								<Button variant="quiet" isIconOnly className="[--addon-button-inset:--spacing(1.5)]">
									<XIcon aria-hidden="true" />
								</Button>
							</InputGroupAddon>
						</InputGroup>
					</SearchField>
					<ListBox>
						<ListBoxSection>
							<ListBoxSectionHeader>Africa</ListBoxSectionHeader>
							<ListBoxItem>Tunisia</ListBoxItem>
							<ListBoxItem>Algeria</ListBoxItem>
							<ListBoxItem>Morocco</ListBoxItem>
						</ListBoxSection>
						<ListBoxSection>
							<ListBoxSectionHeader>America</ListBoxSectionHeader>
							<ListBoxItem>Canada</ListBoxItem>
							<ListBoxItem>United states</ListBoxItem>
						</ListBoxSection>
						<ListBoxSection>
							<ListBoxSectionHeader>Asia</ListBoxSectionHeader>
							<ListBoxItem>India</ListBoxItem>
							<ListBoxItem>Japan</ListBoxItem>
							<ListBoxItem>Korea</ListBoxItem>
						</ListBoxSection>
						<ListBoxSection>
							<ListBoxSectionHeader>Europe</ListBoxSectionHeader>
							<ListBoxItem>France</ListBoxItem>
							<ListBoxItem>Germany</ListBoxItem>
							<ListBoxItem>Spain</ListBoxItem>
							<ListBoxItem>United Kingdom</ListBoxItem>
						</ListBoxSection>
					</ListBox>
				</Command>
			</Popover>
		</Select>
	);
}
