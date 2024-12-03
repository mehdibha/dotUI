import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/registry-v2/lib/cn";

const badgeVariants = tv({
  base: "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md text-xs font-semibold transition-colors",
  variants: {
    variant: {
      neutral: "bg-bg-muted text-fg",
      outline: "text-fg border",
      primary: "bg-bg-primary text-fg-onPrimary",
      success: "bg-bg-success text-fg-onSuccess",
      "success-subtle": "bg-bg-success-muted text-fg-success",
      "success-outline": "border-border-success text-fg-success border",
      danger: "bg-bg-danger text-fg-onDanger",
      "danger-subtle": "bg-bg-danger-muted text-fg-danger",
      "danger-outline": "border-border-danger text-fg-danger border",
      warning: "bg-bg-warning text-fg-onWarning",
      "warning-subtle": "bg-bg-warning-muted text-fg-warning",
      "warning-outline": "border-border-warning text-fg-warning border",
      accent: "bg-bg-accent text-fg-onAccent",
      "accent-subtle": "bg-bg-accent-muted text-fg-accent",
      "accent-outline": "border-border-accent text-fg-accent border",
    },
    size: {
      sm: "h-5 px-2.5 [&_svg]:size-3",
      md: "h-6 px-3 [&_svg]:size-3.5",
      lg: "h-7 px-4 text-sm [&_svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

// TODO: change icon to prefix/suffix

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({
  children,
  className,
  variant,
  size,
  icon,
  ...props
}: BadgeProps) {
  return (
    <span
      role="presentation"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
