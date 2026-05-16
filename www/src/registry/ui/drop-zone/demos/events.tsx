"use client";

import { useDrag } from "react-aria";

import type * as TreePrimitives from "react-aria-components/Tree";

import { DropZone, DropZoneLabel } from "@/registry/ui/drop-zone";

export default function Demo() {
	return (
		<div className="flex items-center gap-8">
			<div className="flex flex-col gap-4">
				<Draggable text="Component A" />
				<Draggable text="Component B" />
			</div>
			<DropZone
				onDrop={async (e) => {
					const items = await Promise.all(
						e.items
							.filter((item) => item.kind === "text" && item.types.has("text/plain"))
							.map((item) => (item as TreePrimitives.TextDropItem).getText("text/plain")),
					);
					alert(`You dropped ${items.join("\n")}`);
				}}
			>
				<DropZoneLabel>Droppable</DropZoneLabel>
			</DropZone>
		</div>
	);
}

const Draggable = ({ text }: { text: string }) => {
	const { dragProps, isDragging } = useDrag({
		getItems() {
			return [
				{
					"text/plain": text,
				},
			];
		},
	});

	return (
		<div className="flex flex-col items-center gap-1">
			<button
				{...dragProps}
				type="button"
				data-dragging={isDragging || undefined}
				className="rounded-sm border bg-muted p-2 transition-all hover:scale-105 data-dragging:opacity-50"
			>
				{text}
			</button>
			<span className="text-xs text-fg-muted">Drag me</span>
		</div>
	);
};
