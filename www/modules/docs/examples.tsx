import { cn } from "@dotui/registry/lib/utils";

export function Examples({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", className)}>
      {children}
    </div>
  );
}
