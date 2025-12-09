import type React from "react";

import { DemoClient } from "./demo.client";
import { loadDemo } from "./load-demo";

export interface DemoProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	previewClassName?: string;
}

export async function Demo({ name, ...props }: DemoProps) {
	const { component: Component, highlightedPreview, highlightedSource } = await loadDemo(name);

	return (
		<DemoClient
			component={<Component />}
			highlightedPreview={highlightedPreview}
			highlightedSource={highlightedSource}
			{...props}
		/>
	);
}
