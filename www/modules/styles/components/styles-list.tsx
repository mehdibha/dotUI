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
  styles,
  skeleton = false,
  ...props
}: React.ComponentProps<"div"> & {
  styles?: RouterOutputs["style"]["getFeatured"];
  skeleton?: boolean;
}) {
  const [variant, setVariant] = React.useState<"ui-kit" | "card">("ui-kit");
  const [query, setQuery] = React.useState("");

  if (skeleton) {
    const placeholders = Array.from({ length: variant === "card" ? 4 : 2 });
    return (
      <div
        className={cn(
          "grid",
          variant === "card" && "grid-cols-2 gap-4",
          variant === "ui-kit" && "grid-cols-1 gap-8",
          props.className,
        )}
      >
        {placeholders.map((_, idx) => (
          <Skeleton
            key={idx}
            className={cn(variant === "card" ? "h-40" : "h-52")}
          />
        ))}
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
        <SearchField
          placeholder="Search styles..."
          className="flex-1"
          onChange={(value) => setQuery(value?.toString() ?? "")}
          value={query}
        />
        <ToggleButtonGroup
          selectedKeys={[variant]}
          onSelectionChange={(value) =>
            setVariant(([...value][0] as "ui-kit" | "card") ?? "ui-kit")
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
          "mt-6 grid",
          variant === "card" && "grid-cols-1 gap-4 md:grid-cols-2",
          variant === "ui-kit" && "grid-cols-1 gap-8",
          props.className,
        )}
      >
        {skeleton && (
          <>
            {Array.from({ length: variant === "card" ? 4 : 2 }).map(
              (_, idx) => (
                <Skeleton
                  key={idx}
                  className={cn(variant === "card" ? "h-40" : "h-52")}
                />
              ),
            )}
          </>
        )}
        {(!styles || styles.length === 0) && (
          <div className="flex items-center justify-center">
            <p className="text-sm text-fg-muted">No styles found</p>
          </div>
        )}
        {filtered.map((style) => (
          <StyleCard key={style.name} style={style} variant={variant} />
        ))}
      </div>
    </div>
  );
}
