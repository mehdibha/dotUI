import { cn } from "@/registry/lib/utils";

export function Examples({ children, className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"mx-auto grid min-h-screen w-full min-w-0 max-w-5xl content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:grid-cols-1 lg:p-12 2xl:max-w-6xl 2xl:grid-cols-1",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
