import { cn } from "@/registry/lib/cn";

function Skeleton({
  className,
  show = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
}) {
  if (!show) return props.children;
  return (
    <span
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
