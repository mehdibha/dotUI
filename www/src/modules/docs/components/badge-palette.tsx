import { cn } from "@/lib/utils";

import type { BadgeProps } from "@dotui/ui/components/badge";
import { Badge } from "@dotui/ui/components/badge";

export function BadgePalette({
  className,
  color,
  ...props
}: BadgeProps & { color: string }) {
  return (
    <Badge
      variant="neutral"
      className={cn("gap-2 rounded-full border pr-1", className)}
      {...props}
    >
      <span>{props.children}</span>
      <span
        className="block size-4 shrink-0 rounded-full border"
        style={{
          backgroundColor: `hsl(var(--color-${color}-500))`,
        }}
      />
    </Badge>
  );
}
