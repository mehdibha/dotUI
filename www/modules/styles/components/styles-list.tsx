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
import { StyleUIKit } from "./style-ui-kit";

export function StylesList({
  styles,
  skeleton = false,
  ...props
}: React.ComponentProps<"div"> & {
  styles?: RouterOutputs["style"]["getFeatured"];
  skeleton?: boolean;
}) {
  const [view, setView] = React.useState<"grid" | "list">("list");

  if (skeleton) {
    const placeholders = Array.from({ length: view === "grid" ? 6 : 3 });
    return (
      <div className={cn("", props.className)}>
        <div
          className={cn(
            "grid",
            view === "grid" && "grid-cols-1 gap-4 lg:grid-cols-2",
            view === "list" && "grid-cols-1 gap-8",
            props.className,
          )}
        >
          {placeholders.map((_, idx) => (
            <Skeleton
              key={idx}
              className={cn(view === "grid" ? "h-40" : "h-52")}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!styles || styles.length === 0) {
    return <div>No styles found</div>;
  }

  return (
    <div className={cn("", props.className)}>
      {/* <div className="flex items-center justify-end gap-4">
        <SearchField
          placeholder="Search styles..."
          className="flex-1"
        />
        <ToggleButtonGroup
          selectedKeys={[view]}
          onSelectionChange={(value) =>
            setView([...value][0] as "grid" | "list")
          }
        >
          <ToggleButton id="grid" variant="primary">
            <LayoutGridIcon />
          </ToggleButton>
          <ToggleButton id="list" variant="primary">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div> */}
      <div
        className={cn(
          "grid",
          view === "grid" && "grid-cols-1 gap-4 lg:grid-cols-2",
          view === "list" && "grid-cols-1 gap-8",
          props.className,
        )}
      >
        {styles.map((style) =>
          view === "grid" ? (
            <StyleCard key={style.name} style={style} />
          ) : (
            <StyleUIKit key={style.name} style={style} />
          ),
        )}
      </div>
    </div>
  );
}
