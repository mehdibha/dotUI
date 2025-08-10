import * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md text-xs font-semibold transition-colors",
  variants: {
    variant: {
      neutral: "bg-bg-muted text-fg border",
      accent: "bg-bg-accent",
      "accent-muted":
        "bg-bg-accent-muted text-fg-accent border-border-accent border",
      success: "bg-bg-success-muted text-fg-success",
      "success-muted": "bg-bg-success-muted text-fg-success",
      danger: "bg-bg-danger-muted text-fg-danger",
      "danger-muted": "bg-bg-danger-muted text-fg-danger",
      warning: "bg-bg-warning-muted text-fg-warning",
      "warning-muted": "bg-bg-warning-muted text-fg-warning",
      info: "bg-bg-info-muted text-fg-info",
      "info-muted": "bg-bg-info-muted text-fg-info",
    },
    size: {
      sm: "px-2.5 py-0.5 [&_svg]:size-4",
      md: "px-3 py-1 [&_svg]:size-3.5",
      lg: "px-4 py-2 text-sm [&_svg]:size-4",
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
