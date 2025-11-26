"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

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

interface PropsTableProps {
  data: PropData[];
  componentName: string;
}

export function PropsTable({ data, componentName }: PropsTableProps) {
  if (data.length === 0) {
    return (
      <p className="text-fg-muted text-sm">
        No props available for this component.
      </p>
    );
  }

  return (
    <div className="my-6 w-full overflow-hidden rounded-md border">
      {/* Header Row */}
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b bg-muted/50 px-3 py-2 font-medium text-fg-muted text-xs sm:grid-cols-[minmax(140px,1fr)_2fr_minmax(80px,auto)_auto]">
        <div>Prop</div>
        <div className="hidden sm:block">Type</div>
        <div className="hidden sm:block">Default</div>
        <div className="w-8" />
      </div>

      {/* Props Rows */}
      <div className="divide-y">
        {data.map((prop) => (
          <PropRow key={prop.name} prop={prop} componentName={componentName} />
        ))}
      </div>
    </div>
  );
}

interface PropRowProps {
  prop: PropData;
  componentName: string;
}

function PropRow({ prop, componentName }: PropRowProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = `${componentName}-${prop.name}`;

  return (
    <div className="group">
      {/* Trigger Row */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-4 px-3 py-2.5 text-left transition-colors sm:grid-cols-[minmax(140px,1fr)_2fr_minmax(80px,auto)_auto]",
          "hover:bg-muted/30",
          isOpen && "bg-muted/20",
        )}
        aria-expanded={isOpen}
      >
        {/* Prop Name */}
        <div className="flex items-baseline gap-1">
          <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem] text-fg">
            {prop.name}
          </code>
          {prop.required && (
            <span className="text-danger text-xs" title="Required">
              *
            </span>
          )}
        </div>

        {/* Type (desktop) - highlighted */}
        <div className="hidden overflow-hidden sm:block">
          <code className="truncate rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem]">
            {prop.shortTypeHighlighted ?? prop.shortType}
          </code>
        </div>

        {/* Default (desktop) - highlighted */}
        <div className="hidden overflow-hidden sm:block">
          {prop.default !== undefined ? (
            <code className="truncate rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem]">
              {prop.defaultHighlighted ?? prop.default}
            </code>
          ) : (
            <span className="text-fg-muted/50">—</span>
          )}
        </div>

        {/* Chevron */}
        <div className="flex w-8 justify-center">
          <ChevronDownIcon
            className={cn(
              "size-4 text-fg-muted transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t bg-muted/10 px-3 py-3">
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
        </div>
      )}
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
