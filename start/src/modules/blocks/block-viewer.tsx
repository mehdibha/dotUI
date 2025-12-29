import { Suspense } from "react";
import { Index } from "@dotui/registry/blocks";

interface BlockViewerProps {
	name: string;
}

export function BlockViewer({ name }: BlockViewerProps) {
	const block = Index[name];

	if (!block) {
		return (
			<div className="flex h-screen items-center justify-center">
				<span className="text-fg-muted">Block not found</span>
			</div>
		);
	}

	const Component = block.component;

	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<span className="text-fg-muted">Loading block...</span>
				</div>
			}
		>
			<Component />
		</Suspense>
	);
}
