"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

import { DisclosureGroup } from "./disclosure-group";

export interface PropData {
  name: string;
  type: string;
  typeHighlighted?: React.ReactNode;
  shortType: string;
  shortTypeHighlighted?: React.ReactNode;
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
}

export function PropsTable({
  data,
  componentName,
  defaultExpandedGroups = new Set(["Content", "Selection", "Value"]),
}: PropsTableProps) {
  const hasAnyProps =
    data.ungrouped.length > 0 ||
    Object.values(data.groups).some((g) => g.length > 0);

  if (!hasAnyProps) {
    return (
      <p className="text-fg-muted text-sm">
        No props available for this component.
      </p>
    );
  }

  return (
    <div className="my-6 w-full overflow-hidden rounded-md border">
      <table className="w-full border-collapse text-sm">
        {/* Header */}
        <thead className="hidden border-b bg-muted/50 sm:table-header-group">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-fg-muted text-xs">
              Prop
            </th>
            <th className="px-3 py-2 text-left font-medium text-fg-muted text-xs">
              Type
            </th>
            <th className="px-3 py-2 text-left font-medium text-fg-muted text-xs">
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
          "cursor-pointer border-b transition-colors hover:bg-muted/30",
          isOpen && "bg-muted/20",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Prop Name */}
        <td className="px-3 py-2.5">
          <button
            type="button"
            id={id}
            className="flex items-baseline gap-1 text-left"
            aria-expanded={isOpen}
          >
            <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem] text-fg">
              {prop.name}
            </code>
            {prop.required && (
              <span className="text-danger text-xs" title="Required">
                *
              </span>
            )}
          </button>
        </td>

        {/* Type */}
        <td className="hidden overflow-hidden px-3 py-2.5 sm:table-cell">
          <code className="truncate rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem]">
            {prop.shortTypeHighlighted ?? prop.shortType}
          </code>
        </td>

        {/* Default */}
        <td className="hidden overflow-hidden px-3 py-2.5 sm:table-cell">
          {prop.default !== undefined ? (
            <code className="truncate rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem]">
              {prop.defaultHighlighted ?? prop.default}
            </code>
          ) : (
            <span className="text-fg-muted/50">—</span>
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

      {/* Expanded description row */}
      {isOpen && (
        <tr className="border-b bg-muted/10">
          <td colSpan={4} className="px-3 py-3">
            <dl className="space-y-3 text-sm">
              {/* Type */}
              <div>
                <dt className="mb-1 font-medium text-fg-muted text-xs uppercase tracking-wide">
                  Type
                </dt>
                <dd>
                  <TypeDisplay
                    type={prop.type}
                    highlighted={prop.typeHighlighted}
                  />
                </dd>
              </div>

              {/* Default Value */}
              {prop.default !== undefined && (
                <div>
                  <dt className="mb-1 font-medium text-fg-muted text-xs uppercase tracking-wide">
                    Default
                  </dt>
                  <dd className="inline-block rounded-md border bg-card px-2 py-1 font-mono text-[0.8125rem]">
                    {prop.defaultHighlighted ?? prop.default}
                  </dd>
                </div>
              )}

              {/* Description */}
              {prop.description && (
                <div>
                  <dt className="mb-1 font-medium text-fg-muted text-xs uppercase tracking-wide">
                    Description
                  </dt>
                  <dd className="text-fg-muted leading-relaxed [&_a]:text-fg [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]">
                    {prop.description}
                  </dd>
                </div>
              )}
            </dl>
          </td>
        </tr>
      )}
    </React.Fragment>
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
      <code className="block whitespace-pre-wrap rounded-md border bg-card p-2 font-mono text-[0.8125rem]">
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
    <code className="inline-block rounded-md border bg-card px-2 py-1 font-mono text-[0.8125rem]">
      {highlighted ?? type}
    </code>
  );
}
