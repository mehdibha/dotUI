import React from "react";

import { cn } from "@dotui/ui/lib/utils";
import type { RouterOutputs } from "@dotui/api";

import { StyleCard } from "./style-card";

export function StylesList({
  styles,
  ...props
}: React.ComponentProps<"div"> & {
  styles: RouterOutputs["style"]["getFeatured"];
}) {
  if (styles.length === 0) {
    return <div>No styles found</div>;
  }

  return (
    <div
      className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", props.className)}
    >
      {styles.map((style) => (
        <StyleCard key={style.name} style={style} />
      ))}
    </div>
  );
}
