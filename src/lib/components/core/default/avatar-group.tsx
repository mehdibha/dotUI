"use client";

import * as React from "react";
import { cn } from "@/lib/utils/classes";

// TODO: handle limit and count props
const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { limit?: number; count?: number }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex -space-x-2 [&>span]:border-2 [&>span]:border-background",
      className
    )}
    {...props}
  ></div>
));
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
