"use client";

import React from "react";
import { LayoutGridIcon, ListIcon } from "lucide-react";

import { SearchField } from "@dotui/ui/components/search-field";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { ToggleButtonGroup } from "@dotui/ui/components/toggle-button-group";
import { cn } from "@dotui/ui/lib/utils";
import type { RouterOutputs } from "@dotui/api";

import { StyleCard } from "./style-card";

export function StylesList({
  defaultView = "card",
  styles,
  skeleton = false,
  search = false,
  ...props
}: React.ComponentProps<"div"> & {
  styles?: RouterOutputs["style"]["getFeatured"];
  skeleton?: boolean;
  search?: boolean;
  defaultView?: "ui-kit" | "card";
}) {
  const [query, setQuery] = React.useState("");

  if (skeleton) {
    const placeholders = Array.from({ length: 3 });
    return (
      <div className={cn("space-y-4", props.className)}>
        {search && (
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 flex-1" />
          </div>
        )}
        <div className={cn("grid grid-cols-3 gap-6", props.className)}>
          {placeholders.map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-6 w-32 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!styles || styles.length === 0) {
    return <div>No styles found</div>;
  }

  const filtered = styles.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.description ?? "").toLowerCase().includes(q) ||
      s.user.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className={cn("", props.className)}>
      <div className="flex items-center justify-end gap-4">
        {search && (
          <SearchField
            placeholder="Search styles..."
            className="flex-1"
            onChange={(value) => setQuery(value?.toString() ?? "")}
            value={query}
          />
        )}
      </div>
      <div
        className={cn(
          "grid",
          search && "mt-4",
          "grid-cols-3 gap-6",
          props.className,
        )}
      >
        {(!styles || styles.length === 0) && (
          <div className="flex items-center justify-center">
            <p className="text-fg-muted text-sm">No styles found</p>
          </div>
        )}
        {filtered.map((style) => (
          <StyleCard key={style.name} style={style} variant="card" />
        ))}
      </div>
    </div>
  );
}
