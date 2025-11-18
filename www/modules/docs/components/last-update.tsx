import type React from "react";

import { cn } from "@dotui/registry/lib/utils";

export function PageLastUpdate({
  date,
  className,
  ...props
}: { date: Date } & React.ComponentProps<"p">) {
  if (!date) return null;
  
  return (
    <p className={cn("text-fg-muted text-sm", className)} {...props}>
      Last updated on {new Date(date).toLocaleDateString()}
    </p>
  );
}
