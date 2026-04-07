import { cn } from "@/registry/lib/utils";

export function Examples({ children, className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"mx-auto grid min-h-screen w-full min-w-0 max-w-5xl grid-cols-1 content-center items-start gap-12 p-12",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
