"use client";

import React from "react";
import { LayoutGridIcon, ListIcon } from "lucide-react";

import { SearchField } from "@dotui/ui/components/search-field";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { ToggleButtonGroup } from "@dotui/ui/components/toggle-button-group";
import { cn } from "@dotui/ui/lib/utils";
import type { RouterOutputs } from "@dotui/api";

import { StyleUIKit } from "./style-ui-kit";

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
    const placeholders = Array.from({ length: variant === "card" ? 6 : 3 });
    return (
      <div className={cn("", props.className)}>
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
      <div className="mb-4 flex items-center justify-end gap-4">
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
          "grid",
          variant === "card" && "grid-cols-2 gap-4",
          variant === "ui-kit" && "grid-cols-1 gap-8",
          props.className,
        )}
      >
        {filtered.map((style) => (
          <StyleUIKit key={style.name} style={style} variant={variant} />
        ))}
      </div>
    </div>
  );
}
