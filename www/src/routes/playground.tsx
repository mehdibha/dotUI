import { createFileRoute } from "@tanstack/react-router";

import { Label } from "@/registry/ui/field";
import { ListBox } from "@/registry/ui/list-box";
import { Modal } from "@/registry/ui/modal";
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
					The first select is the existing popover path. The second swaps SelectContent for a Modal child.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<Select defaultSelectedKey="perplexity">
					<Label>Popover</Label>
					<SelectTrigger />
					<SelectContent>
						{providers.map((provider) => (
							<SelectItem key={provider.id} id={provider.id}>
								{provider.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select defaultSelectedKey="together-ai">
					<Label>Modal</Label>
					<SelectTrigger />
					<Modal className="p-1">
						<ListBox>
							{providers.map((provider) => (
								<SelectItem key={provider.id} id={provider.id}>
									{provider.name}
								</SelectItem>
							))}
						</ListBox>
					</Modal>
				</Select>
			</div>
		</div>
	);
}
