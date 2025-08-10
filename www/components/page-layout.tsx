import { cn } from "@dotui/ui/lib/utils";

export function PageLayout({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("pt-4 pb-14 md:pt-10 lg:pt-16", className)} {...props} />
  );
}

export function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("container", className)} {...props}>
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
        "leading-tighter max-w-2xl text-2xl font-semibold tracking-tight text-balance lg:text-3xl lg:leading-[1.1] xl:text-4xl xl:tracking-tighter",
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
        "mt-1 max-w-3xl text-base text-balance text-fg-muted sm:text-lg",
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
