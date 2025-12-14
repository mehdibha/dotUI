"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

export interface RenderPropData {
	name: string;
	selector: string;
	selectorHighlighted?: React.ReactNode;
	description?: React.ReactNode;
}

interface RenderPropsTableProps {
	data: RenderPropData[];
	componentName: string;
}

// Grid layout: [Name] [Selector] [Chevron]
const GRID_LAYOUT = cn("grid grid-cols-[minmax(120px,1fr)_1fr_2.5rem]", "md:grid-cols-[5fr_7fr_2.5rem]");

// Panel grid layout
const PANEL_GRID_LAYOUT = cn(
	"flex flex-col gap-3",
	"sm:grid sm:grid-cols-[minmax(120px,1fr)_1fr_2.5rem] sm:gap-x-4 sm:gap-y-2",
	"md:grid-cols-[5fr_7fr_2.5rem]",
);

export function RenderPropsTable({ data, componentName }: RenderPropsTableProps) {
	if (data.length === 0) {
		return null;
	}

	return (
		<div className="my-6 w-full overflow-hidden rounded-md border">
			<table className="w-full border-collapse text-sm">
				{/* Header */}
				<thead className="border-b bg-card">
					<tr className={GRID_LAYOUT}>
						<th className="px-3 py-2 text-left font-medium text-fg-muted text-xs">Name</th>
						<th className="px-3 py-2 text-left font-medium text-fg-muted text-xs">CSS Selector</th>
						<th className="w-10 px-3 py-2" />
					</tr>
				</thead>

				<tbody className="bg-bg">
					{data.map((renderProp) => (
						<RenderPropRow key={renderProp.name} renderProp={renderProp} componentName={componentName} />
					))}
				</tbody>
			</table>
		</div>
	);
}

interface RenderPropRowProps {
	renderProp: RenderPropData;
	componentName: string;
}

function RenderPropRow({ renderProp, componentName }: RenderPropRowProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const id = `${componentName}-render-${renderProp.name}`;

	return (
		<React.Fragment>
			{/* Main row */}
			<tr
				className={cn(GRID_LAYOUT, "cursor-pointer border-b transition-colors hover:bg-muted")}
				onClick={() => setIsOpen(!isOpen)}
			>
				{/* Name */}
				<td className="overflow-hidden px-3 py-2.5">
					<button type="button" id={id} className="flex items-baseline gap-1 text-left" aria-expanded={isOpen}>
						<code className="whitespace-nowrap font-mono text-[0.8125rem] text-fg">{renderProp.name}</code>
					</button>
				</td>

				{/* CSS Selector */}
				<td className="overflow-hidden px-3 py-2.5">
					<code className="whitespace-nowrap break-keep font-mono text-[0.8125rem] text-fg-muted">
						{renderProp.selectorHighlighted ?? renderProp.selector}
					</code>
				</td>

				{/* Chevron */}
				<td className="px-3 py-2.5 text-center">
					<ChevronDownIcon
						className={cn(
							"inline-block size-4 text-fg-muted transition-transform duration-200",
							isOpen && "rotate-180",
						)}
					/>
				</td>
			</tr>

			{/* Expanded panel row */}
			{isOpen && (
				<tr className="border-b bg-card">
					<td colSpan={3} className="px-3 py-3">
						<dl className={PANEL_GRID_LAYOUT}>
							{/* Name - with anchor link */}
							<DescriptionItem label="Name">
								<a href={`#${id}`} className="hover:underline">
									<code className="font-mono text-[0.8125rem] text-primary">{renderProp.name}</code>
								</a>
							</DescriptionItem>

							{/* CSS Selector */}
							<DescriptionItem label="CSS Selector" hasSeparator>
								<code className="rounded-md border bg-muted/50 px-2 py-1 font-mono text-[0.8125rem]">
									{renderProp.selectorHighlighted ?? renderProp.selector}
								</code>
							</DescriptionItem>

							{/* Description */}
							{renderProp.description && (
								<DescriptionItem label="Description" hasSeparator>
									<div className="text-fg-muted leading-relaxed [&_a]:text-fg [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]">
										{renderProp.description}
									</div>
								</DescriptionItem>
							)}
						</dl>
					</td>
				</tr>
			)}
		</React.Fragment>
	);
}

interface DescriptionItemProps {
	label: string;
	children: React.ReactNode;
	hasSeparator?: boolean;
}

function DescriptionItem({ label, children, hasSeparator }: DescriptionItemProps) {
	return (
		<div
			className={cn(
				"sm:col-span-2 sm:grid sm:grid-cols-subgrid",
				hasSeparator && "border-border/50 border-t pt-2 sm:border-t-0 sm:pt-0",
			)}
		>
			<dt className="mb-1 font-medium text-fg-muted text-xs sm:mb-0 sm:py-1">{label}</dt>
			<dd className="sm:py-1">{children}</dd>
		</div>
	);
}
