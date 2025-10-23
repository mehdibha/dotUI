import type * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors",
  variants: {
    variant: {
      neutral: "border bg-muted text-fg",
      accent: "bg-accent",
      "accent-muted":
        "border border-border-accent bg-accent-muted text-fg-accent",
      success: "bg-success-muted text-fg-success",
      "success-muted": "bg-success-muted text-fg-success",
      danger: "bg-danger-muted text-fg-danger",
      "danger-muted": "bg-danger-muted text-fg-danger",
      warning: "bg-warning-muted text-fg-warning",
      "warning-muted": "bg-warning-muted text-fg-warning",
      info: "bg-info-muted text-fg-info",
      "info-muted": "bg-info-muted text-fg-info",
    },
    size: {
      sm: "px-2.5 py-0.5 [&_svg]:size-4",
      md: "px-3 py-1 [&_svg]:size-3.5",
      lg: "px-4 py-1 text-sm [&_svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "md",
  },
});

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeStyles> {}
const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
  return (
    <span
      role="presentation"
      className={badgeStyles({ variant, size, className })}
      {...props}
    />
  );
};

export type { BadgeProps };
export { Badge };
