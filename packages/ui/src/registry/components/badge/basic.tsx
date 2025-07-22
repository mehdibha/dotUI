import * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors",
  variants: {
    variant: {
      neutral: "bg-bg-muted text-fg",
      accent: "bg-bg-accent-muted text-fg-accent",
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
      sm: "py-0.5 px-2.5 [&_svg]:size-4",
      md: "py-1 px-3 [&_svg]:size-3.5",
      lg: "py-2 px-4 text-sm [&_svg]:size-4",
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
