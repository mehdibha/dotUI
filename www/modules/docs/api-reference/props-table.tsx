"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

export interface PropData {
  name: string;
  type: string;
  default?: string;
  description?: React.ReactNode; // Pre-rendered on server
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
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b bg-muted/50 px-3 py-2 font-medium text-fg-muted text-xs sm:grid-cols-[minmax(160px,1fr)_2fr_auto]">
        <div>Prop</div>
        <div className="hidden sm:block">Type</div>
        <div className="w-8" />
      </div>

      {/* Props Rows */}
      <div className="divide-y">
        {data.map((prop, index) => (
          <PropRow
            key={prop.name}
            prop={prop}
            componentName={componentName}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface PropRowProps {
  prop: PropData;
  componentName: string;
  index: number;
}

function PropRow({ prop, componentName }: PropRowProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = `${componentName}-${prop.name}`;
  const shortType = getShortType(prop.name, prop.type);

  return (
    <div className="group">
      {/* Trigger Row */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-4 px-3 py-2.5 text-left transition-colors sm:grid-cols-[minmax(160px,1fr)_2fr_auto]",
          "hover:bg-muted/30",
          isOpen && "bg-muted/20",
        )}
        aria-expanded={isOpen}
      >
        {/* Prop Name */}
        <div className="flex items-baseline gap-1">
          <code className="font-mono text-[0.8125rem] text-fg">
            {prop.name}
          </code>
          {prop.required && (
            <span className="text-danger text-xs" title="Required">
              *
            </span>
          )}
        </div>

        {/* Type (desktop) */}
        <div className="hidden overflow-hidden sm:block">
          <code className="truncate font-mono text-[0.8125rem] text-fg-muted">
            {shortType.display}
          </code>
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
            {/* Type (always shown in expanded) */}
            <div>
              <dt className="mb-1 font-medium text-fg-muted text-xs uppercase tracking-wide">
                Type
              </dt>
              <dd>
                <TypeDisplay type={prop.type} />
              </dd>
            </div>

            {/* Default Value */}
            {prop.default !== undefined && (
              <div>
                <dt className="mb-1 font-medium text-fg-muted text-xs uppercase tracking-wide">
                  Default
                </dt>
                <dd>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem]">
                    {prop.default}
                  </code>
                </dd>
              </div>
            )}

            {/* Description (pre-rendered on server) */}
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

function TypeDisplay({ type }: { type: string }) {
  // Format multi-line types nicely
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
    <code className="rounded-md border bg-card px-2 py-1 font-mono text-[0.8125rem]">
      {type}
    </code>
  );
}

/**
 * Get a shortened version of the type for display in the collapsed row
 */
function getShortType(
  name: string,
  type: string | undefined,
): { display: string; hasMore: boolean } {
  if (!type) {
    return { display: "unknown", hasMore: false };
  }

  // Event handlers show as "function"
  if (/^on[A-Z]/.test(name)) {
    return { display: "function", hasMore: true };
  }

  // className/style render props
  if (name === "className" && type.includes("=>")) {
    return { display: "string | function", hasMore: true };
  }
  if (name === "style" && type.includes("=>")) {
    return { display: "CSSProperties | function", hasMore: true };
  }

  // Simple types
  if (
    type === "boolean" ||
    type === "string" ||
    type === "number" ||
    type === "boolean | undefined" ||
    type === "string | undefined" ||
    type === "number | undefined"
  ) {
    return { display: type, hasMore: false };
  }

  // Short union types
  if (!type.includes("|") || (type.split("|").length < 4 && type.length < 50)) {
    return { display: type, hasMore: false };
  }

  // Complex unions
  return { display: "union", hasMore: true };
}
