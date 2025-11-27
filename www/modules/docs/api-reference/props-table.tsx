"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

import { Type, TypeRendererProvider } from "./components/type-renderer";
import { DisclosureGroup } from "./disclosure-group";
import type { TType, TypeLinksRegistry } from "./types/type-ast";

export interface PropData {
  name: string;
  type: string;
  typeHighlighted?: React.ReactNode;
  shortType: string;
  shortTypeHighlighted?: React.ReactNode;
  /** AST representation for rich type rendering with popovers */
  typeAst?: TType;
  default?: string;
  defaultHighlighted?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
}

export interface GroupedPropsData {
  ungrouped: PropData[];
  groups: Record<string, PropData[]>;
}

interface PropsTableProps {
  data: GroupedPropsData;
  componentName: string;
  defaultExpandedGroups?: Set<string>;
  /** Type links registry for navigating to type definitions */
  typeLinks?: TypeLinksRegistry;
}

// Grid layout - always show Prop & Type, hide Default on sm
// sm: [Prop] [Type] [Chevron]
// md+: [Prop] [Type] [Default] [Chevron]
const GRID_LAYOUT = cn(
  "grid grid-cols-[minmax(120px,1fr)_1fr_2.5rem]",
  "md:grid-cols-[5fr_7fr_4.5fr_2.5rem]",
);

// Panel grid layout (aligns with header)
const PANEL_GRID_LAYOUT = cn(
  "flex flex-col gap-3",
  "sm:grid sm:grid-cols-[minmax(120px,1fr)_1fr_2.5rem] sm:gap-x-4 sm:gap-y-2",
  "md:grid-cols-[5fr_11.5fr_2.5rem]",
);

export function PropsTable({
  data,
  componentName,
  defaultExpandedGroups = new Set(["Content", "Selection", "Value"]),
  typeLinks = {},
}: PropsTableProps) {
  const hasAnyProps =
    data.ungrouped.length > 0 ||
    Object.values(data.groups).some((g) => g.length > 0);

  if (!hasAnyProps) {
    return null;
  }

  return (
    <TypeRendererProvider links={typeLinks}>
      <div className="w-full overflow-hidden rounded-md border text-sm">
        <table className="w-full border-collapse [&>tbody:last-child>tr:last-child>td]:border-b-0 [&>tbody:last-child>tr:last-child]:border-b-0">
          {/* Header */}
          <thead className="border-b bg-card">
            <tr className={GRID_LAYOUT}>
              <th className="px-3 py-2 text-left font-medium text-fg-muted">
                Prop
              </th>
              <th className="px-3 py-2 text-left font-medium text-fg-muted">
                Type
              </th>
              <th className="hidden px-3 py-2 text-left font-medium text-fg-muted md:table-cell">
                Default
              </th>
              <th className="w-10 px-3 py-2" />
            </tr>
          </thead>

          {/* Ungrouped props */}
          {data.ungrouped.length > 0 && (
            <tbody className="bg-bg">
              {data.ungrouped.map((prop) => (
                <PropRows
                  key={prop.name}
                  prop={prop}
                  componentName={componentName}
                />
              ))}
            </tbody>
          )}

          {/* Grouped props */}
          {Object.entries(data.groups).map(([groupName, props]) => (
            <DisclosureGroup
              key={groupName}
              title={groupName}
              defaultExpanded={defaultExpandedGroups.has(groupName)}
            >
              {props.map((prop) => (
                <PropRows
                  key={prop.name}
                  prop={prop}
                  componentName={componentName}
                />
              ))}
            </DisclosureGroup>
          ))}
        </table>
      </div>
    </TypeRendererProvider>
  );
}

interface PropRowsProps {
  prop: PropData;
  componentName: string;
}

function PropRows({ prop, componentName }: PropRowsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = `${componentName}-${prop.name}`;

  return (
    <React.Fragment>
      {/* Main prop row */}
      <tr
        className={cn(
          GRID_LAYOUT,
          "cursor-pointer border-b transition-colors hover:bg-muted",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Prop Name */}
        <td className="overflow-hidden px-3 py-2.5">
          <button
            type="button"
            id={id}
            className="flex items-baseline gap-1 text-left"
            aria-expanded={isOpen}
          >
            <code className="whitespace-nowrap font-mono text-[0.8125rem] text-fg">
              {prop.name}
              {prop.required && (
                <sup className="top-[-0.3em] ml-0.5 text-danger">*</sup>
              )}
            </code>
          </button>
        </td>

        {/* Type - always visible */}
        <td className="overflow-hidden px-3 py-2.5">
          <code className="whitespace-nowrap break-keep font-mono text-[0.8125rem] text-fg-muted">
            {prop.shortTypeHighlighted ?? prop.shortType}
          </code>
        </td>

        {/* Default - hidden on sm */}
        <td className="hidden overflow-hidden px-3 py-2.5 md:table-cell">
          {prop.default !== undefined ? (
            <code className="whitespace-nowrap font-mono text-[0.8125rem] text-fg-muted">
              {prop.defaultHighlighted ?? prop.default}
            </code>
          ) : (
            <code className="font-mono text-[0.8125rem] text-fg-muted/50">
              —
            </code>
          )}
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
          <td colSpan={4} className="px-3 py-3">
            <dl className={PANEL_GRID_LAYOUT}>
              {/* Name - with anchor link */}
              <DescriptionItem label="Name">
                <a href={`#${id}`} className="hover:underline">
                  <code className="font-mono text-[0.8125rem] text-primary">
                    {prop.name}
                  </code>
                </a>
              </DescriptionItem>

              {/* Description */}
              {prop.description && (
                <DescriptionItem label="Description" hasSeparator>
                  <div className="text-fg-muted leading-relaxed [&_a]:text-fg [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]">
                    {prop.description}
                  </div>
                </DescriptionItem>
              )}

              {/* Type - use AST renderer if available for rich popovers */}
              <DescriptionItem label="Type" hasSeparator>
                {prop.typeAst ? (
                  <Type type={prop.typeAst} />
                ) : (
                  <TypeDisplay
                    type={prop.type}
                    highlighted={prop.typeHighlighted}
                  />
                )}
              </DescriptionItem>

              {/* Default */}
              {prop.default !== undefined && (
                <DescriptionItem label="Default" hasSeparator>
                  <code className="font-mono text-[0.8125rem]">
                    {prop.defaultHighlighted ?? prop.default}
                  </code>
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

function DescriptionItem({
  label,
  children,
  hasSeparator,
}: DescriptionItemProps) {
  return (
    <div
      className={cn(
        "sm:col-span-2 sm:grid sm:grid-cols-subgrid",
        hasSeparator && "border-border/50 border-t pt-2 sm:border-t-0 sm:pt-0",
      )}
    >
      <dt className="mb-1 font-medium text-fg-muted sm:mb-0 sm:py-1">
        {label}
      </dt>
      <dd className="sm:py-1">{children}</dd>
    </div>
  );
}

interface TypeDisplayProps {
  type: string;
  highlighted?: React.ReactNode;
}

function TypeDisplay({ type, highlighted }: TypeDisplayProps) {
  const isMultiLine = type.includes("|") && type.length > 60;

  if (isMultiLine) {
    const parts = type.split("|").map((p) => p.trim());
    return (
      <code className="block overflow-x-auto whitespace-pre-wrap rounded-md border bg-card p-2 font-mono text-[0.8125rem]">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-fg-muted">{"\n| "}</span>}
            <span>{part}</span>
          </React.Fragment>
        ))}
      </code>
    );
  }

  return (
    <code className="font-mono text-[0.8125rem]">{highlighted ?? type}</code>
  );
}
