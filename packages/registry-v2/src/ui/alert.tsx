import type * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const alertVariants = tv({
  slots: {
    base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    title: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
    description:
      "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
  },
  variants: {
    variant: {
      neutral: {
        base: "text-fg",
      },
      danger: {
        base: "bg-danger-muted text-fg-danger *:data-[slot=alert-description]:text-fg-danger/90 [&>svg]:text-current",
      },
      warning: {
        base: "text-fg-warning *:data-[slot=alert-description]:text-fg-warning/90 [&>svg]:text-current",
      },
      info: {
        base: "text-fg-info *:data-[slot=alert-description]:text-fg-info/90 [&>svg]:text-current",
      },
      success: {
        base: "text-fg-success *:data-[slot=alert-description]:text-fg-success/90 [&>svg]:text-current",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { base, title, description } = alertVariants();

function AlertBase({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={base({ variant, className })}
      {...props}
    />
  );
}
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="alert-title" className={title({ className })} {...props} />
  );
}
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={description({ className })}
      {...props}
    />
  );
}

const Alert = Object.assign(AlertBase, {
  Title: AlertTitle,
  Description: AlertDescription,
});

export { Alert, AlertTitle, AlertDescription };
