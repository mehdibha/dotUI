"use client";

import * as React from "react";

import { GripVerticalIcon } from "lucide-react";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { useListData } from "react-stately";

import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableContainer,
	TableDropIndicator,
	TableHeader,
	TableRow,
} from "@/registry/ui/table";

const columns: Column[] = [
	{ name: "Name", id: "name", isRowHeader: true },
	{ name: "Type", id: "type" },
	{ name: "Date Modified", id: "date" },
];

const dragItemType = "application/x-dotui-table-row";

export default function Demo() {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [previewWidth, setPreviewWidth] = React.useState(448);
	const list = useListData<Item>({
		initialItems: [
			{ id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
			{ id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
			{ id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
			{ id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
		],
	});

	React.useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updatePreviewWidth = () => {
			const table = container.querySelector<HTMLElement>("[data-slot=table]");
			const width = table?.getBoundingClientRect().width ?? container.getBoundingClientRect().width;
			setPreviewWidth(Math.round(width));
		};

		updatePreviewWidth();

		if (typeof ResizeObserver === "undefined") return;

		const observer = new ResizeObserver(updatePreviewWidth);
		observer.observe(container);

		const table = container.querySelector<HTMLElement>("[data-slot=table]");
		if (table) observer.observe(table);

		return () => observer.disconnect();
	}, []);

	const { dragAndDropHooks } = useDragAndDrop<Item>({
		getItems: (_keys, items) =>
			items.map((item) => {
				return {
					"text/plain": item.name,
					[dragItemType]: JSON.stringify(item),
				};
			}),
		renderDragPreview: (items) => {
			const draggedItems = items
				.map((item) => parseDraggedItem(item[dragItemType]))
				.filter((item): item is Item => item != null);
			const item = draggedItems[0] ?? {
				id: 0,
				name: items[0]?.["text/plain"] ?? "Row",
				type: "",
				date: "",
			};

			return (
				<div
					className="pointer-events-none grid overflow-hidden rounded-md border border-border bg-bg text-sm text-fg shadow-lg ring-1 ring-inverse/5"
					style={{
						gridTemplateColumns: "2rem minmax(0,1.4fr) minmax(0,0.8fr) minmax(0,0.8fr)",
						width: previewWidth,
					}}
				>
					<div className="flex h-10 items-center justify-center border-r border-border text-fg-muted">
						<GripVerticalIcon aria-hidden className="size-4" />
					</div>
					<div className="flex h-10 min-w-0 items-center gap-2 border-r border-border px-2.5 font-medium">
						<span className="truncate">{item.name}</span>
						{draggedItems.length > 1 && (
							<span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs font-normal text-fg-muted">
								{draggedItems.length}
							</span>
						)}
					</div>
					<div className="flex h-10 min-w-0 items-center border-r border-border px-2.5 text-fg-muted">
						<span className="truncate">{item.type}</span>
					</div>
					<div className="flex h-10 min-w-0 items-center px-2.5 text-fg-muted">
						<span className="truncate">{item.date}</span>
					</div>
				</div>
			);
		},
		renderDropIndicator: (target) => <TableDropIndicator target={target} />,
		onReorder(e) {
			if (e.target.dropPosition === "before") {
				list.moveBefore(e.target.key, e.keys);
			} else if (e.target.dropPosition === "after") {
				list.moveAfter(e.target.key, e.keys);
			}
		},
	});

	return (
		<TableContainer ref={containerRef}>
			<Table aria-label="Files" dragAndDropHooks={dragAndDropHooks}>
				<TableHeader columns={columns}>
					{(column) => <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>}
				</TableHeader>
				<TableBody items={list.items}>
					{(item) => <TableRow columns={columns}>{(column) => <TableCell>{item[column.id]}</TableCell>}</TableRow>}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function parseDraggedItem(value: unknown) {
	if (typeof value !== "string") return null;

	try {
		return JSON.parse(value) as Item;
	} catch {
		return null;
	}
}

interface Item {
	id: number;
	name: string;
	date: string;
	type: string;
}

interface Column {
	id: keyof Omit<Item, "id">;
	name: string;
	isRowHeader?: boolean;
}
