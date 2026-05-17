"use client";

import * as React from "react";

import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircleIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	CircleIcon,
	CircleOffIcon,
	HelpCircleIcon,
	MoreHorizontalIcon,
	PlusCircleIcon,
	Settings2Icon,
	TimerIcon,
	XIcon,
} from "lucide-react";
import {
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type Column as TanStackColumn,
	type ColumnDef,
	type ColumnFiltersState,
	type FilterFn,
	type Row as TanStackRow,
	type RowSelectionState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import * as AutocompletePrimitive from "react-aria-components/Autocomplete";

import type { Selection } from "react-aria-components";
import type { SortDescriptor } from "react-aria-components/Table";

import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { Table, TableBody, TableCell, TableColumn, TableContainer, TableHeader, TableRow } from "@/registry/ui/table";

const labels = [
	{ value: "bug", label: "Bug" },
	{ value: "feature", label: "Feature" },
	{ value: "documentation", label: "Documentation" },
] as const;

const statuses = [
	{ value: "backlog", label: "Backlog", icon: HelpCircleIcon, variant: "neutral" },
	{ value: "todo", label: "Todo", icon: CircleIcon, variant: "info" },
	{ value: "in progress", label: "In Progress", icon: TimerIcon, variant: "warning" },
	{ value: "done", label: "Done", icon: CheckCircleIcon, variant: "success" },
	{ value: "canceled", label: "Canceled", icon: CircleOffIcon, variant: "danger" },
] as const;

const priorities = [
	{ value: "low", label: "Low", icon: ArrowDownIcon },
	{ value: "medium", label: "Medium", icon: ArrowRightIcon },
	{ value: "high", label: "High", icon: ArrowUpIcon },
] as const;

const tasks: Task[] = [
	{
		id: "TASK-8782",
		title: "You can't compress the program without quantifying the open-source SSD pixel!",
		status: "in progress",
		label: "documentation",
		priority: "medium",
	},
	{
		id: "TASK-7878",
		title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
		status: "backlog",
		label: "documentation",
		priority: "medium",
	},
	{ id: "TASK-7839", title: "We need to bypass the neural TCP card!", status: "todo", label: "bug", priority: "high" },
	{
		id: "TASK-5562",
		title: "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
		status: "backlog",
		label: "feature",
		priority: "medium",
	},
	{
		id: "TASK-8686",
		title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
		status: "canceled",
		label: "feature",
		priority: "medium",
	},
	{
		id: "TASK-1280",
		title: "Use the digital TLS panel, then you can transmit the haptic system!",
		status: "done",
		label: "bug",
		priority: "high",
	},
	{
		id: "TASK-7262",
		title: "The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!",
		status: "done",
		label: "feature",
		priority: "high",
	},
	{
		id: "TASK-1138",
		title: "Generating the driver won't do anything, we need to quantify the 1080p SMTP bandwidth!",
		status: "in progress",
		label: "feature",
		priority: "medium",
	},
	{
		id: "TASK-7184",
		title: "We need to program the back-end THX pixel!",
		status: "todo",
		label: "feature",
		priority: "low",
	},
	{
		id: "TASK-5160",
		title: "Calculating the bus won't do anything, we need to navigate the back-end JSON protocol!",
		status: "in progress",
		label: "documentation",
		priority: "high",
	},
	{
		id: "TASK-5618",
		title: "Generating the driver won't do anything, we need to index the online SSL application!",
		status: "done",
		label: "documentation",
		priority: "medium",
	},
	{
		id: "TASK-6699",
		title: "I'll transmit the wireless JBOD capacitor, that should hard drive the SSD feed!",
		status: "backlog",
		label: "documentation",
		priority: "medium",
	},
	{
		id: "TASK-2858",
		title: "We need to override the online UDP bus!",
		status: "backlog",
		label: "bug",
		priority: "medium",
	},
	{
		id: "TASK-9864",
		title: "I'll reboot the 1080p FTP panel, that should matrix the HEX hard drive!",
		status: "done",
		label: "bug",
		priority: "high",
	},
	{
		id: "TASK-8404",
		title: "We need to generate the virtual HEX alarm!",
		status: "in progress",
		label: "bug",
		priority: "low",
	},
	{
		id: "TASK-5365",
		title: "Backing up the pixel won't do anything, we need to transmit the primary IB array!",
		status: "in progress",
		label: "documentation",
		priority: "low",
	},
	{
		id: "TASK-1780",
		title: "The CSS feed is down, index the bluetooth transmitter so we can compress the CLI protocol!",
		status: "todo",
		label: "documentation",
		priority: "high",
	},
	{
		id: "TASK-6938",
		title: "Use the redundant SCSI application, then you can hack the optical alarm!",
		status: "todo",
		label: "documentation",
		priority: "high",
	},
	{
		id: "TASK-9885",
		title: "We need to compress the auxiliary VGA driver!",
		status: "backlog",
		label: "bug",
		priority: "high",
	},
	{
		id: "TASK-3216",
		title: "Transmitting the transmitter won't do anything, we need to compress the virtual HDD sensor!",
		status: "backlog",
		label: "documentation",
		priority: "medium",
	},
	{
		id: "TASK-9285",
		title: "The IP monitor is down, copy the haptic alarm so we can generate the HTTP transmitter!",
		status: "todo",
		label: "bug",
		priority: "high",
	},
	{
		id: "TASK-1024",
		title: "Overriding the microchip won't do anything, we need to transmit the digital OCR transmitter!",
		status: "in progress",
		label: "documentation",
		priority: "low",
	},
	{
		id: "TASK-7068",
		title: "You can't generate the capacitor without indexing the wireless HEX pixel!",
		status: "canceled",
		label: "bug",
		priority: "low",
	},
	{
		id: "TASK-6502",
		title: "Navigating the microchip won't do anything, we need to bypass the back-end SQL bus!",
		status: "todo",
		label: "bug",
		priority: "high",
	},
	{
		id: "TASK-5326",
		title: "We need to hack the redundant UTF8 transmitter!",
		status: "todo",
		label: "bug",
		priority: "low",
	},
	{
		id: "TASK-6274",
		title: "Use the virtual PCI circuit, then you can parse the bluetooth alarm!",
		status: "canceled",
		label: "documentation",
		priority: "low",
	},
	{
		id: "TASK-1571",
		title: "I'll input the neural DRAM circuit, that should protocol the SMTP interface!",
		status: "in progress",
		label: "feature",
		priority: "medium",
	},
	{
		id: "TASK-9518",
		title: "Compressing the interface won't do anything, we need to compress the online SDD matrix!",
		status: "canceled",
		label: "documentation",
		priority: "medium",
	},
	{
		id: "TASK-5581",
		title: "I'll synthesize the digital COM pixel, that should transmitter the UTF8 protocol!",
		status: "backlog",
		label: "documentation",
		priority: "high",
	},
	{
		id: "TASK-2197",
		title: "Parsing the feed won't do anything, we need to copy the bluetooth DRAM bus!",
		status: "todo",
		label: "documentation",
		priority: "low",
	},
];

const pageSizes = [5, 10, 20] as const;
const statusByValue = Object.fromEntries(statuses.map((status) => [status.value, status])) as Record<
	StatusValue,
	(typeof statuses)[number]
>;
const priorityByValue = Object.fromEntries(priorities.map((priority) => [priority.value, priority])) as Record<
	PriorityValue,
	(typeof priorities)[number]
>;
const labelByValue = Object.fromEntries(labels.map((label) => [label.value, label])) as Record<
	LabelValue,
	(typeof labels)[number]
>;
const emptyCounts = new Map<unknown, number>();

const selectedOptionsFilter: FilterFn<Task> = (row, columnId, filterValue) => {
	const selectedValues = Array.isArray(filterValue) ? filterValue.map(String) : [];
	return selectedValues.length === 0 || selectedValues.includes(String(row.getValue(columnId)));
};

const taskColumns: ColumnDef<Task>[] = [
	{
		id: "id",
		accessorKey: "id",
		header: "Task",
		enableHiding: false,
		enableGlobalFilter: true,
		meta: {
			name: "Task",
			width: 120,
			cellClassName: "font-mono text-xs text-fg-muted",
		} satisfies TaskColumnMeta,
		cell: ({ row }) => row.original.id,
	},
	{
		id: "title",
		accessorKey: "title",
		header: "Title",
		enableGlobalFilter: true,
		meta: {
			name: "Title",
			minWidth: 420,
			cellClassName: "min-w-[26rem]",
		} satisfies TaskColumnMeta,
		cell: ({ row }) => (
			<div className="flex min-w-0 items-center gap-2">
				<Badge appearance="subtle" variant="neutral" size="sm">
					{labelByValue[row.original.label].label}
				</Badge>
				<span className="truncate font-medium">{row.original.title}</span>
			</div>
		),
	},
	{
		id: "status",
		accessorKey: "status",
		header: "Status",
		enableGlobalFilter: false,
		filterFn: selectedOptionsFilter,
		sortingFn: (a, b, columnId) => {
			return statusByValue[a.getValue<StatusValue>(columnId)].label.localeCompare(
				statusByValue[b.getValue<StatusValue>(columnId)].label,
			);
		},
		meta: {
			name: "Status",
			width: 150,
		} satisfies TaskColumnMeta,
		cell: ({ row }) => {
			const status = statusByValue[row.original.status];
			const Icon = status.icon;

			return (
				<Badge appearance="subtle" variant={status.variant} size="sm">
					<Icon />
					{status.label}
				</Badge>
			);
		},
	},
	{
		id: "priority",
		accessorKey: "priority",
		header: "Priority",
		enableGlobalFilter: false,
		filterFn: selectedOptionsFilter,
		sortingFn: (a, b, columnId) => {
			return priorityByValue[a.getValue<PriorityValue>(columnId)].label.localeCompare(
				priorityByValue[b.getValue<PriorityValue>(columnId)].label,
			);
		},
		meta: {
			name: "Priority",
			width: 120,
		} satisfies TaskColumnMeta,
		cell: ({ row }) => {
			const priority = priorityByValue[row.original.priority];
			const Icon = priority.icon;

			return (
				<div className="flex items-center gap-2 text-fg-muted">
					<Icon className="size-3.5" />
					<span>{priority.label}</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		enableHiding: false,
		enableSorting: false,
		enableGlobalFilter: false,
		meta: {
			name: "Actions",
			width: 48,
			className: "w-10",
			cellClassName: "text-right",
		} satisfies TaskColumnMeta,
		cell: ({ row }) => (
			<Menu>
				<Button aria-label={`Open actions for ${row.original.id}`} variant="quiet" size="sm" isIconOnly>
					<MoreHorizontalIcon />
				</Button>
				<Popover placement="bottom end">
					<MenuContent className="min-w-40">
						<MenuItem>Edit</MenuItem>
						<MenuItem>Make a copy</MenuItem>
						<MenuItem>Favorite</MenuItem>
						<MenuItem variant="danger">Delete</MenuItem>
					</MenuContent>
				</Popover>
			</Menu>
		),
	},
];

export default function Demo() {
	const { contains } = AutocompletePrimitive.useFilter({
		sensitivity: "base",
		ignorePunctuation: true,
	});
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: false }]);

	const taskSearchFilter = React.useCallback<FilterFn<Task>>(
		(row, columnId, filterValue) => {
			const query = String(filterValue ?? "").trim();
			return !query || contains(String(row.getValue(columnId) ?? ""), query);
		},
		[contains],
	);

	const table = useReactTable({
		columns: taskColumns,
		data: tasks,
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getRowId: (task) => task.id,
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: taskSearchFilter,
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: setGlobalFilter,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		state: {
			columnFilters,
			columnVisibility,
			globalFilter,
			rowSelection,
			sorting,
		},
	});

	const headerGroup = table.getHeaderGroups()[0];
	const tableHeaders = headerGroup?.headers ?? [];
	const currentRows = table.getRowModel().rows;
	const visibleColumnKey = tableHeaders.map((header) => header.id).join(":");
	const columnDependencies = React.useMemo(() => [visibleColumnKey], [visibleColumnKey]);
	const selectedKeys = React.useMemo(() => rowSelectionToSelection(rowSelection), [rowSelection]);
	const sortDescriptor = React.useMemo(() => toSortDescriptor(sorting), [sorting]);
	const statusColumn = table.getColumn("status");
	const priorityColumn = table.getColumn("priority");
	const statusFilter = getColumnFilterSet(statusColumn);
	const priorityFilter = getColumnFilterSet(priorityColumn);
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const pageCount = Math.max(1, table.getPageCount());
	const filteredRowCount = table.getFilteredRowModel().rows.length;
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const isFiltered = Boolean(globalFilter) || columnFilters.length > 0;

	const updateQuery = React.useCallback(
		(value: string) => {
			table.setGlobalFilter(value);
			table.setPageIndex(0);
		},
		[table],
	);
	const updateStatusFilter = React.useCallback(
		(selection: Selection) => {
			statusColumn?.setFilterValue(selectionToFilterValue(selection, statuses));
			table.setPageIndex(0);
		},
		[statusColumn, table],
	);
	const updatePriorityFilter = React.useCallback(
		(selection: Selection) => {
			priorityColumn?.setFilterValue(selectionToFilterValue(selection, priorities));
			table.setPageIndex(0);
		},
		[priorityColumn, table],
	);
	const resetFilters = React.useCallback(() => {
		table.resetColumnFilters();
		table.setGlobalFilter("");
		table.setPageIndex(0);
	}, [table]);
	const updateSelection = React.useCallback(
		(keys: Selection) => {
			setRowSelection((currentSelection) => selectionToRowSelection(keys, currentRows, currentSelection));
		},
		[currentRows],
	);
	const updateSort = React.useCallback(
		(descriptor: SortDescriptor) => {
			setSorting(toSortingState(descriptor));
			table.setPageIndex(0);
		},
		[table],
	);
	const updatePageSize = React.useCallback(
		(key: React.Key | null) => {
			if (!key) return;
			table.setPageSize(Number(key));
			table.setPageIndex(0);
		},
		[table],
	);

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="space-y-1">
				<h3 className="text-lg font-semibold">Welcome back!</h3>
				<p className="text-sm text-fg-muted">Here&apos;s a list of your tasks for this month.</p>
			</div>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					<SearchField aria-label="Filter tasks" value={globalFilter} onChange={updateQuery} className="w-full sm:w-64">
						<Input placeholder="Filter tasks..." size="sm" />
					</SearchField>
					<FacetedFilter
						title="Status"
						options={statuses}
						counts={statusColumn?.getFacetedUniqueValues() ?? emptyCounts}
						selectedKeys={statusFilter}
						onSelectionChange={updateStatusFilter}
					/>
					<FacetedFilter
						title="Priority"
						options={priorities}
						counts={priorityColumn?.getFacetedUniqueValues() ?? emptyCounts}
						selectedKeys={priorityFilter}
						onSelectionChange={updatePriorityFilter}
					/>
					{isFiltered && (
						<Button variant="quiet" size="sm" onPress={resetFilters}>
							Reset
							<XIcon />
						</Button>
					)}
				</div>
				<div className="flex items-center gap-2">
					<ViewOptions columns={table.getAllLeafColumns()} />
					<Button size="sm">Add Task</Button>
				</div>
			</div>
			<TableContainer resizable className="rounded-md border">
				<Table
					aria-label="Tasks"
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectionChange={updateSelection}
					sortDescriptor={sortDescriptor}
					onSortChange={updateSort}
				>
					<TableHeader columns={tableHeaders} dependencies={columnDependencies}>
						{(header) => {
							const meta = getColumnMeta(header.column);

							return (
								<TableColumn
									id={header.column.id}
									isRowHeader={header.column.id === "title"}
									allowsSorting={header.column.getCanSort()}
									width={meta.width}
									minWidth={meta.minWidth}
									className={meta.className}
								>
									{header.column.id === "actions" ? (
										<span className="sr-only">{meta.name}</span>
									) : (
										flexRender(header.column.columnDef.header, header.getContext())
									)}
								</TableColumn>
							);
						}}
					</TableHeader>
					<TableBody items={currentRows} dependencies={columnDependencies} renderEmptyState={() => "No results."}>
						{(row) => (
							<TableRow columns={row.getVisibleCells()} dependencies={columnDependencies} textValue={getTaskTextValue(row.original)}>
								{(cell) => (
									<TableCell className={getColumnMeta(cell.column).cellClassName}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
				<div className="text-fg-muted">
					{selectedCount} of {filteredRowCount} row(s) selected.
				</div>
				<div className="flex flex-wrap items-center gap-3 sm:justify-end">
					<div className="flex items-center gap-2">
						<span className="text-fg-muted">Rows per page</span>
						<Select aria-label="Rows per page" selectedKey={String(pageSize)} onSelectionChange={updatePageSize}>
							<SelectTrigger size="sm" className="w-20" />
							<SelectContent placement="top">
								{pageSizes.map((size) => (
									<SelectItem id={String(size)} key={size}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="min-w-24 text-center font-medium">
						Page {pageIndex + 1} of {pageCount}
					</div>
					<div className="flex items-center gap-1">
						<Button
							aria-label="Go to first page"
							variant="quiet"
							size="sm"
							isIconOnly
							isDisabled={!table.getCanPreviousPage()}
							onPress={() => table.setPageIndex(0)}
						>
							<ChevronsLeftIcon />
						</Button>
						<Button
							aria-label="Go to previous page"
							variant="quiet"
							size="sm"
							isIconOnly
							isDisabled={!table.getCanPreviousPage()}
							onPress={() => table.previousPage()}
						>
							<ChevronLeftIcon />
						</Button>
						<Button
							aria-label="Go to next page"
							variant="quiet"
							size="sm"
							isIconOnly
							isDisabled={!table.getCanNextPage()}
							onPress={() => table.nextPage()}
						>
							<ChevronRightIcon />
						</Button>
						<Button
							aria-label="Go to last page"
							variant="quiet"
							size="sm"
							isIconOnly
							isDisabled={!table.getCanNextPage()}
							onPress={() => table.setPageIndex(pageCount - 1)}
						>
							<ChevronsRightIcon />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function FacetedFilter({
	title,
	options,
	counts,
	selectedKeys,
	onSelectionChange,
}: {
	title: string;
	options: readonly FilterOption[];
	counts: Map<unknown, number>;
	selectedKeys: Set<string>;
	onSelectionChange: (selection: Selection) => void;
}) {
	return (
		<Menu>
			<Button variant="default" size="sm" className="border-dashed">
				<PlusCircleIcon />
				{title}
				{selectedKeys.size > 0 && (
					<Badge appearance="subtle" variant="neutral" size="sm" className="ml-1">
						{selectedKeys.size}
					</Badge>
				)}
			</Button>
			<Popover placement="bottom start">
				<MenuContent
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectionChange={onSelectionChange}
					className="min-w-48"
				>
					{options.map((option) => {
						const Icon = option.icon;

						return (
							<MenuItem id={option.value} key={option.value} textValue={option.label}>
								<Icon className="text-fg-muted" />
								<span className="flex-1">{option.label}</span>
								<span className="ml-auto font-mono text-xs text-fg-muted">{counts.get(option.value) ?? 0}</span>
							</MenuItem>
						);
					})}
				</MenuContent>
			</Popover>
		</Menu>
	);
}

function ViewOptions({ columns }: { columns: TanStackColumn<Task, unknown>[] }) {
	const hideableColumns = columns.filter((column) => column.getCanHide());
	const selectedKeys = new Set(hideableColumns.filter((column) => column.getIsVisible()).map((column) => column.id));

	return (
		<Menu>
			<Button variant="default" size="sm">
				<Settings2Icon />
				View
			</Button>
			<Popover placement="bottom end">
				<MenuContent
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectionChange={(keys) => {
						const nextVisibleIds =
							keys === "all"
								? new Set(hideableColumns.map((column) => column.id))
								: new Set(Array.from(keys).map(String));

						for (const column of hideableColumns) {
							column.toggleVisibility(nextVisibleIds.has(column.id));
						}
					}}
					className="min-w-40"
				>
					{hideableColumns.map((column) => (
						<MenuItem id={column.id} key={column.id}>
							{getColumnMeta(column).name}
						</MenuItem>
					))}
				</MenuContent>
			</Popover>
		</Menu>
	);
}

function selectionToFilterValue(selection: Selection, options: readonly FilterOption[]) {
	const values = selection === "all" ? options.map((option) => option.value) : Array.from(selection).map(String);
	return values.length > 0 ? values : undefined;
}

function getColumnFilterSet(column?: TanStackColumn<Task, unknown>) {
	const value = column?.getFilterValue();
	return new Set(Array.isArray(value) ? value.map(String) : []);
}

function rowSelectionToSelection(rowSelection: RowSelectionState): Selection {
	return new Set(Object.entries(rowSelection).filter(([, isSelected]) => isSelected).map(([id]) => id));
}

function selectionToRowSelection(
	selection: Selection,
	rows: TanStackRow<Task>[],
	currentSelection: RowSelectionState,
): RowSelectionState {
	const visibleRowIds = new Set(rows.map((row) => row.id));
	const nextSelection: RowSelectionState = {};

	for (const [id, isSelected] of Object.entries(currentSelection)) {
		if (isSelected && !visibleRowIds.has(id)) {
			nextSelection[id] = true;
		}
	}

	if (selection === "all") {
		for (const row of rows) {
			nextSelection[row.id] = true;
		}
		return nextSelection;
	}

	for (const key of selection) {
		nextSelection[String(key)] = true;
	}

	return nextSelection;
}

function getTaskTextValue(task: Task) {
	return [
		task.id,
		task.title,
		labelByValue[task.label].label,
		statusByValue[task.status].label,
		priorityByValue[task.priority].label,
	].join(" ");
}

function toSortDescriptor(sorting: SortingState): SortDescriptor | undefined {
	const firstSort = sorting[0];
	if (!firstSort) return undefined;

	return {
		column: firstSort.id,
		direction: firstSort.desc ? "descending" : "ascending",
	};
}

function toSortingState(descriptor: SortDescriptor): SortingState {
	return [
		{
			id: String(descriptor.column),
			desc: descriptor.direction === "descending",
		},
	];
}

function getColumnMeta(column: TanStackColumn<Task, unknown>) {
	return column.columnDef.meta as TaskColumnMeta;
}

interface TaskColumnMeta {
	name: string;
	width?: number;
	minWidth?: number;
	className?: string;
	cellClassName?: string;
}

type LabelValue = (typeof labels)[number]["value"];
type StatusValue = (typeof statuses)[number]["value"];
type PriorityValue = (typeof priorities)[number]["value"];

interface Task {
	id: string;
	label: LabelValue;
	priority: PriorityValue;
	status: StatusValue;
	title: string;
}

type FilterOption = (typeof statuses)[number] | (typeof priorities)[number];
