import { BackgroundColor } from "@adobe/leonardo-contrast-colors";
import { cn } from "@/lib/cn";
import { Badge, BadgeProps } from "@/components/core/badge";

export function BadgePalette({
  className,
  color,
  ...props
}: BadgeProps & { color: string }) {
  return (
    <Badge
      variant="neutral"
      // size="sm"
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
