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
  const [view, setView] = React.useState<"ui-kit" | "card">(defaultView);
  const [query, setQuery] = React.useState("");

  if (skeleton) {
    const placeholders = Array.from({ length: view === "card" ? 4 : 2 });
    return (
      <div className={cn("space-y-4", props.className)}>
        <div className="flex items-center justify-end gap-4">
          {search && <Skeleton className="h-10 flex-1" />}
          <Skeleton className="h-10 w-20" />
        </div>
        <div
          className={cn(
            "grid",
            view === "card" && "grid-cols-2 gap-4",
            view === "ui-kit" && "grid-cols-1 gap-8",
            !search && "-mt-8",
            props.className,
          )}
        >
          {placeholders.map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-6 w-32 rounded-full" />
                ))}
              </div>
              <Skeleton className={cn(view === "card" ? "h-72" : "h-120")} />
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
        <ToggleButtonGroup
          selectionMode="single"
          selectedKeys={[view]}
          disallowEmptySelection
          onSelectionChange={(value) =>
            setView([...value][0] as "ui-kit" | "card")
          }
        >
          <ToggleButton id="card" variant="primary">
            <LayoutGridIcon />
          </ToggleButton>
          <ToggleButton id="ui-kit" variant="primary">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div
        className={cn(
          "-mt-4 grid",
          search && "mt-6",
          view === "card" && "grid-cols-1 gap-6 md:grid-cols-2",
          view === "ui-kit" && "grid-cols-1 gap-8",
          props.className,
        )}
      >
        {skeleton && (
          <>
            {Array.from({ length: view === "card" ? 4 : 2 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className={cn(view === "card" ? "h-40" : "h-52")}
              />
            ))}
          </>
        )}
        {(!styles || styles.length === 0) && (
          <div className="flex items-center justify-center">
            <p className="text-fg-muted text-sm">No styles found</p>
          </div>
        )}
        {filtered.map((style) => (
          <StyleCard key={style.name} style={style} variant={view} />
        ))}
      </div>
    </div>
  );
}
