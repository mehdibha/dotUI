import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const alertVariants = tv({
  slots: {
    base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    title: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
    description:
      "col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
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

/* -----------------------------------------------------------------------------------------------*/

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={base({ variant, className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AlertTitleProps extends React.ComponentProps<"div"> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <div data-slot="alert-title" className={title({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={description({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AlertActionProps extends React.ComponentProps<"div"> {}

function AlertAction({ className, ...props }: AlertActionProps) {
  return <div data-slot="alert-action" {...props} />;
}

/* -----------------------------------------------------------------------------------------------*/

export { Alert, AlertTitle, AlertDescription, AlertAction };

export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
};
