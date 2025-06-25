// work in progress
// Auto layout skeleton inspiration: https://x.com/devongovett/status/1838980741197447529
import { cn } from "@/lib/utils";

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
        "relative block h-6 animate-pulse rounded-md bg-bg-muted",
        props.children && "h-auto *:invisible",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
