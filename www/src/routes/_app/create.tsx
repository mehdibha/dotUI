import { createFileRoute } from "@tanstack/react-router";

import { CustomizerPanel } from "@/modules/create/customizer-panel";

export const Route = createFileRoute("/_app/create")({
	component: CreatePage,
});

function CreatePage() {
	return (
		<div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-row gap-6 p-6">
			<CustomizerPanel />
			<iframe
				src="/view/cards"
				// src="https://ui.shadcn.com/preview/radix/preview?preset=b2oXluOGo&iconLibrary=hugeicons&style=vega&theme=pink&chartColor=green&font=playfair-display&baseColor=olive&menuColor=default-translucent&radius=large"
				title="preview"
				className="flex-1 rounded-xl border"
			/>
		</div>
	);
}
