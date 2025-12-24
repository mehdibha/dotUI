import * as React from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import type { TransformedProp, TransformedPropsData, TransformedReference } from "@/modules/references";
import { Type, TypeRendererProvider } from "@/modules/references/components/type-renderer";

const GRID_LAYOUT = "grid grid-cols-[minmax(120px,1fr)_1fr_2.5rem] md:grid-cols-[5fr_7fr_4.5fr_2.5rem]";

const PANEL_GRID_LAYOUT =
	"flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(120px,1fr)_1fr_2.5rem] sm:gap-x-4 sm:gap-y-2 md:grid-cols-[5fr_11.5fr_2.5rem]";

export interface ReferenceProps extends React.ComponentProps<"div"> {
	data: TransformedReference;
}

export function Reference({ data, ...props }: ReferenceProps) {
	return (
		<TypeRendererProvider links={data.typeLinks ?? {}}>
			<div {...props}>
				{data.description && <p className="mb-4 text-fg-muted">{data.description}</p>}
				{data.extendsElement && (
					<p className="mb-4 text-fg-muted">
						Supports all{" "}
						<a
							href={getHtmlElementLink(data.extendsElement)}
							target="_blank"
							rel="noopener noreferrer"
							className="text-fg-accent hover:underline"
						>
							{data.extendsElement === "html" ? "HTML" : data.extendsElement}
						</a>{" "}
						attributes.
					</p>
				)}
				<PropsTable data={data.data} componentName={data.name} defaultExpandedGroups={data.defaultExpandedGroups} />
			</div>
		</TypeRendererProvider>
	);
}

function getHtmlElementLink(element: string) {
	if (element === "html") {
		return "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes";
	}
	return `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${element}#attributes`;
}

interface PropsTableProps {
	data: TransformedPropsData;
	componentName: string;
	defaultExpandedGroups: string[];
}

function PropsTable({ data, componentName, defaultExpandedGroups }: PropsTableProps) {
	const hasAnyProps = data.ungrouped.length > 0 || Object.values(data.groups).some((g) => g.length > 0);

	if (!hasAnyProps) {
		return null;
	}

	return (
		<div className="w-full overflow-hidden rounded-md border text-sm">
			<table className="w-full border-collapse [&>tbody:last-child>tr:last-child>td]:border-b-0 [&>tbody:last-child>tr:last-child]:border-b-0">
				<thead className="border-b bg-card">
					<tr className={GRID_LAYOUT}>
						<th className="px-3 py-2 text-left font-medium text-fg-muted">Prop</th>
						<th className="px-3 py-2 text-left font-medium text-fg-muted">Type</th>
						<th className="hidden px-3 py-2 text-left font-medium text-fg-muted md:table-cell">Default</th>
						<th className="w-10 px-3 py-2" />
					</tr>
				</thead>

				{data.ungrouped.length > 0 && (
					<tbody className="bg-bg">
						{data.ungrouped.map((prop) => (
							<PropRows key={prop.name} prop={prop} componentName={componentName} />
						))}
					</tbody>
				)}

				{Object.entries(data.groups).map(([groupName, props]) => (
					<DisclosureGroup
						key={groupName}
						title={groupName}
						defaultExpanded={defaultExpandedGroups.includes(groupName)}
					>
						{props.map((prop) => (
							<PropRows key={prop.name} prop={prop} componentName={componentName} />
						))}
					</DisclosureGroup>
				))}
			</table>
		</div>
	);
}

interface PropRowsProps {
	prop: TransformedProp;
	componentName: string;
}

function PropRows({ prop, componentName }: PropRowsProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const id = `${componentName}-${prop.name}`;

	return (
		<React.Fragment>
			<tr
				className={`${GRID_LAYOUT} cursor-pointer border-b transition-colors hover:bg-card`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<td className="overflow-hidden px-3 py-2.5">
					<button type="button" id={id} className="flex items-baseline gap-1 text-left" aria-expanded={isOpen}>
						<code className="whitespace-nowrap font-mono text-[0.8125rem] text-fg">
							{prop.name}
							{prop.required && <sup className="top-[-0.3em] ml-0.5 text-fg-danger">*</sup>}
						</code>
					</button>
				</td>

				<td className="overflow-hidden px-3 py-2.5">
					<code
						className="whitespace-nowrap break-keep font-mono text-[0.8125rem] text-fg-muted **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
						dangerouslySetInnerHTML={{ __html: prop.shortTypeHighlighted }}
					/>
				</td>

				<td className="hidden overflow-hidden px-3 py-2.5 md:table-cell">
					{prop.default !== undefined ? (
						<code
							className="whitespace-nowrap font-mono text-[0.8125rem] text-fg-muted **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
							dangerouslySetInnerHTML={{
								__html: prop.defaultHighlighted ?? prop.default,
							}}
						/>
					) : (
						<code className="font-mono text-[0.8125rem] text-fg-muted/50">—</code>
					)}
				</td>

				<td className="px-3 py-2.5 text-center">
					<ChevronDownIcon
						className={`inline-block size-4 text-fg-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
					/>
				</td>
			</tr>

			{isOpen && (
				<tr className="border-b bg-card">
					<td colSpan={4} className="px-3 py-3">
						<dl className={PANEL_GRID_LAYOUT}>
							<DescriptionItem label="Name">
								<a href={`#${id}`} className="hover:underline">
									<code className="font-mono text-[0.8125rem] text-fg-accent">{prop.name}</code>
								</a>
							</DescriptionItem>

							{prop.description && (
								<DescriptionItem label="Description" hasSeparator>
									<div className="text-fg-muted leading-relaxed [&_a]:text-fg [&_a]:underline [&_code]:rounded [&_code]:bg-card [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]">
										{prop.description}
									</div>
								</DescriptionItem>
							)}

							<DescriptionItem label="Type" hasSeparator>
								<Type type={prop.typeAst} />
							</DescriptionItem>

							{prop.default !== undefined && (
								<DescriptionItem label="Default" hasSeparator>
									<code
										className="font-mono text-[0.8125rem] **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
										dangerouslySetInnerHTML={{
											__html: prop.defaultHighlighted ?? prop.default,
										}}
									/>
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
			className={`sm:col-span-2 sm:grid sm:grid-cols-subgrid ${hasSeparator ? "border-border/50 border-t pt-2 sm:border-t-0 sm:pt-0" : ""}`}
		>
			<dt className="mb-1 font-medium text-fg-muted sm:mb-0 sm:py-1">{label}</dt>
			<dd className="sm:py-1">{children}</dd>
		</div>
	);
}


interface DisclosureGroupProps {
	title: string;
	defaultExpanded?: boolean;
	children: React.ReactNode;
}

function DisclosureGroup({ title, defaultExpanded = false, children }: DisclosureGroupProps) {
	const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

	return (
		<tbody className="bg-bg">
			<tr>
				<td colSpan={4} className="border-b p-0">
					<button
						type="button"
						onClick={() => setIsExpanded(!isExpanded)}
						aria-expanded={isExpanded}
						className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left font-medium text-sm outline-none transition-colors hover:bg-card/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${isExpanded ? "bg-card/30" : ""}`}
					>
						<ChevronRightIcon
							className={`size-4 text-fg-muted transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
						/>
						{title}
					</button>
				</td>
			</tr>
			{isExpanded && children}
		</tbody>
	);
}
