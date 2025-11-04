import { cn } from "@dotui/registry/lib/utils";

export function PageLayout({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

export function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("container py-8 lg:py-14", className)} {...props}>
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
      className={cn(
        "mt-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    />
  );
}
