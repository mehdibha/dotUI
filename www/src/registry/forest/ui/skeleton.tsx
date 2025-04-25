// work in progress
// Auto layout skeleton inspiration: https://x.com/devongovett/status/1838980741197447529
import { cn } from "@/registry/forest/lib/utils";

function Skeleton({
  className,
  show = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
}) {
  if (!show) return props.children;
  return (
    <div
      className={cn(
        "bg-bg-muted relative block h-6 animate-pulse rounded-md",
        props.children && "h-auto *:invisible",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
