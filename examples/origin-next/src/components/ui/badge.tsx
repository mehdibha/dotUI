import type * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";
const badgeVariants = tv({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none",
  variants: {
    appearance: {
      solid: "bg-(--badge-fill) text-(--badge-fg)",
      soft: "bg-(--badge-tint) text-(--badge-fg-tint)",
      outline: "border border-(--badge-border) text-(--badge-fg-tint)",
      "soft-outline":
        "border border-(--badge-border) bg-(--badge-tint) text-(--badge-fg-tint)",
    },
    variant: {
      neutral:
        "[--badge-border:var(--color-border)] [--badge-fg-tint:var(--color-fg)] [--badge-fg:var(--color-fg-on-neutral)] [--badge-fill:var(--color-neutral)] [--badge-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)]",
      accent:
        "[--badge-border:var(--color-border-accent)] [--badge-fg-tint:var(--color-fg-accent)] [--badge-fg:var(--color-fg-on-accent)] [--badge-fill:var(--color-accent)] [--badge-tint:var(--color-accent-muted)]",
      danger:
        "[--badge-border:var(--color-border-danger)] [--badge-fg-tint:var(--color-fg-danger)] [--badge-fg:var(--color-fg-on-danger)] [--badge-fill:var(--color-danger)] [--badge-tint:var(--color-danger-muted)]",
      success:
        "[--badge-border:var(--color-border-success)] [--badge-fg-tint:var(--color-fg-success)] [--badge-fg:var(--color-fg-on-success)] [--badge-fill:var(--color-success)] [--badge-tint:var(--color-success-muted)]",
      warning:
        "[--badge-border:var(--color-border-warning)] [--badge-fg-tint:var(--color-fg-warning)] [--badge-fg:var(--color-fg-on-warning)] [--badge-fill:var(--color-warning)] [--badge-tint:var(--color-warning-muted)]",
      info: "[--badge-border:var(--color-border-info)] [--badge-fg-tint:var(--color-fg-info)] [--badge-fg:var(--color-fg-on-info)] [--badge-fill:var(--color-info)] [--badge-tint:var(--color-info-muted)]",
    },
    size: {
      sm: "h-4.5 min-w-4.5 px-1.5 **:data-loader:*:[svg]:size-2.5 [&>svg]:size-2.5",
      md: "h-5 min-w-5 px-1.75 **:data-loader:*:[svg]:size-3 [&>svg]:size-3",
      lg: "h-5.5 min-w-5.5 px-2.25 **:data-loader:*:[svg]:size-3.5 [&>svg]:size-3.5",
    },
  },
  defaultVariants: {
    appearance: "solid",
    variant: "neutral",
    size: "md",
  },
});

interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}
const Badge = ({
  className,
  appearance,
  variant,
  size,
  ...props
}: BadgeProps) => {
  const styles = badgeVariants;
  return (
    <span
      role="presentation"
      data-badge=""
      className={styles({ appearance, variant, size, className })}
      {...props}
    />
  );
};

export type { BadgeProps };
export { Badge };
