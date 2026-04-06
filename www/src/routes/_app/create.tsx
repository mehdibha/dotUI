import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CustomizerPanel } from "@/modules/create/customizer-panel";

export const Route = createFileRoute("/_app/create")({
	component: CreatePage,
});

function CreatePage() {
	const [selectedComponent, setSelectedComponent] = useState("accordion");
	const iframeSrc = `/preview/${selectedComponent}`;

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-row gap-6 p-6 pt-2">
			<CustomizerPanel selectedComponent={selectedComponent} onComponentChange={setSelectedComponent} />
			<iframe key={iframeSrc} src={iframeSrc} title="preview" className="flex-1 rounded-xl border" />
		</div>
	);
}
