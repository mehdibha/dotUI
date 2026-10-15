import type * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full font-medium whitespace-nowrap [&>svg]:pointer-events-none text-xs",
  variants: {
    appearance: {
      solid: "bg-(--chip-fill) text-(--chip-fg)",
      soft: "bg-(--chip-tint) text-(--chip-fg-tint)",
      outline: "border border-(--chip-border) text-(--chip-fg-tint)",
      "soft-outline":
        "border border-(--chip-border) bg-(--chip-tint) text-(--chip-fg-tint)",
      dot: "border border-border text-fg before:size-2 before:shrink-0 before:rounded-full before:bg-(--chip-dot,var(--chip-fill)) before:content-['']",
    },
    variant: {
      neutral:
        "[--chip-border:var(--color-border)] [--chip-dot:var(--color-fg-muted)] [--chip-fg-tint:var(--color-fg)] [--chip-fg:var(--color-fg-on-neutral)] [--chip-fill:var(--color-neutral)] [--chip-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)]",
      accent:
        "[--chip-border:var(--color-border-accent)] [--chip-fg-tint:var(--color-fg-accent)] [--chip-fg:var(--color-fg-on-accent)] [--chip-fill:var(--color-accent)] [--chip-tint:var(--color-accent-muted)]",
      danger:
        "[--chip-border:var(--color-border-danger)] [--chip-fg-tint:var(--color-fg-danger)] [--chip-fg:var(--color-fg-on-danger)] [--chip-fill:var(--color-danger)] [--chip-tint:var(--color-danger-muted)]",
      success:
        "[--chip-border:var(--color-border-success)] [--chip-fg-tint:var(--color-fg-success)] [--chip-fg:var(--color-fg-on-success)] [--chip-fill:var(--color-success)] [--chip-tint:var(--color-success-muted)]",
      warning:
        "[--chip-border:var(--color-border-warning)] [--chip-fg-tint:var(--color-fg-warning)] [--chip-fg:var(--color-fg-on-warning)] [--chip-fill:var(--color-warning)] [--chip-tint:var(--color-warning-muted)]",
      info: "[--chip-border:var(--color-border-info)] [--chip-fg-tint:var(--color-fg-info)] [--chip-fg:var(--color-fg-on-info)] [--chip-fill:var(--color-info)] [--chip-tint:var(--color-info-muted)]",
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
  return (
    <span
      role="presentation"
      data-badge=""
      className={badgeVariants({ appearance, variant, size, className })}
      {...props}
    />
  );
};

export type { BadgeProps };
export { Badge };
