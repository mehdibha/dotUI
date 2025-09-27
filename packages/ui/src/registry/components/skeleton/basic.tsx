// work in progress
// Auto layout skeleton inspiration: https://x.com/devongovett/status/1838980741197447529
import { cn } from "@dotui/ui/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
};

function Skeleton({ className, show = true, ...props }: SkeletonProps) {
  if (!show) return props.children;
  return (
    <div
      className={cn(
        "bg-muted relative block h-6 animate-pulse rounded-md",
        props.children && "h-auto text-transparent *:invisible *:!m-0",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
