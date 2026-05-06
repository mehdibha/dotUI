import { createFileRoute } from "@tanstack/react-router";

import { Command } from "@/registry/ui/command";
import { DialogContent } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";
import { Label } from "@/registry/ui/field";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Modal } from "@/registry/ui/modal";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

const providers = [
	{ id: "perplexity", name: "Perplexity" },
	{ id: "replicate", name: "Replicate" },
	{ id: "together-ai", name: "Together AI" },
	{ id: "eleven-labs", name: "ElevenLabs" },
	{ id: "openai", name: "OpenAI" },
	{ id: "anthropic", name: "Anthropic" },
];

function RouteComponent() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 p-8">
			<div className="space-y-2">
				<h1 className="font-semibold text-2xl">Select Overlay Test</h1>
				<p className="text-fg-muted text-sm">
					The first select is the existing popover path. The second swaps SelectContent for a Drawer child.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<Select defaultValue={["perplexity"]} selectionMode="multiple">
					<Label>select in popover</Label>
					<SelectTrigger />
					<SelectContent>
						{providers.map((provider) => (
							<SelectItem key={provider.id} id={provider.id}>
								{provider.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select defaultValue="together-ai">
					<Label>select in drawer</Label>
					<SelectTrigger />
					<Drawer placement="bottom" className="p-1">
						<DrawerHandle />
						<ListBox>
							{providers.map((provider) => (
								<SelectItem key={provider.id} id={provider.id}>
									{provider.name}
								</SelectItem>
							))}
						</ListBox>
					</Drawer>
				</Select>

				<Select defaultValue="together-ai">
					<Label>select in modal</Label>
					<SelectTrigger />
					<Modal>
						<DialogContent>
							<Command>
								<SearchField autoFocus />
								<ListBox selectionMode="single">
									{providers.map((provider) => (
										<ListBoxItem key={provider.id} id={provider.id}>
											{provider.name}
										</ListBoxItem>
									))}
								</ListBox>
							</Command>
						</DialogContent>
					</Modal>
				</Select>
			</div>
		</div>
	);
}
