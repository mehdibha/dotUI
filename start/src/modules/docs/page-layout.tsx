import { cn } from "@dotui/registry/lib/utils";

export function PageLayout({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("", className)} {...props} />;
}

export function PageHeader({ className, children, ...props }: React.ComponentProps<"section">) {
	return (
		<section data-page-header className={cn("container py-6 md:py-8 lg:py-14", className)} {...props}>
			{children}
		</section>
	);
}

export function PageHeaderHeading({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"max-w-2xl text-balance font-semibold text-2xl leading-tighter lg:text-3xl lg:leading-[1.1] xl:text-4xl",
				className,
			)}
			{...props}
		/>
	);
}

export function PageHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
	return <p className={cn("mt-1 max-w-3xl text-balance text-base text-fg-muted sm:text-lg", className)} {...props} />;
}

export function PageActions({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("mt-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center", className)} {...props} />;
}
