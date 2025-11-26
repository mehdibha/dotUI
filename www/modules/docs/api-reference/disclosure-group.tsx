"use client";

import * as React from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

interface DisclosureGroupProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  colSpan?: number;
}

export function DisclosureGroup({
  title,
  defaultExpanded = false,
  children,
  colSpan = 4,
}: DisclosureGroupProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <tbody className="bg-bg">
      {/* Disclosure trigger row */}
      <tr>
        <td colSpan={colSpan} className="border-b p-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left font-medium text-sm outline-none transition-colors",
              "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isExpanded && "bg-muted/30",
            )}
          >
            <ChevronRightIcon
              className={cn(
                "size-4 text-fg-muted transition-transform duration-200",
                isExpanded && "rotate-90",
              )}
            />
            {title}
          </button>
        </td>
      </tr>
      {/* Expanded content rows */}
      {isExpanded && children}
    </tbody>
  );
}
