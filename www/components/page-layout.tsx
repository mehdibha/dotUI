import { cn } from "@dotui/ui/lib/utils";

export function PageLayout({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "container relative pb-14 pt-4 md:pt-10 lg:pt-16",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("", className)} {...props}>
      {children}
    </section>
  );
}

export function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "leading-tighter max-w-2xl text-balance text-2xl font-semibold tracking-tight lg:text-3xl lg:font-semibold lg:leading-[1.1] xl:text-4xl xl:tracking-tighter",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-fg-muted mt-1 max-w-3xl text-balance text-base sm:text-lg",
        className,
      )}
      {...props}
    />
  );
}

export function PageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-4 flex w-full items-center gap-2", className)}
      {...props}
    />
  );
}
