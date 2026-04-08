import { cn } from "@/registry/lib/utils";

export function Examples({ className, children }: { className?: string; children: React.ReactNode }) {
	return <div className={cn("grid grid-cols-3 gap-2 **:[h3]:text-sm **:[h3]:font-medium **:[h3]:text-fg-muted", className)}>{children}</div>;
}
