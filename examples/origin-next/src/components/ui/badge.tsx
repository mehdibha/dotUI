import type * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";
const badgeVariants = tv({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none",
  variants: {
    appearance: {
      solid: "bg-(--badge-color) text-(--badge-fg)",
      subtle:
        "bg-[color-mix(in_srgb,var(--badge-color)_30%,var(--color-bg))] text-[color-mix(in_srgb,var(--badge-color)_60%,var(--color-fg))]",
    },
    variant: {
      neutral: "bg-neutral text-fg-on-neutral",
      accent:
        "[--badge-color:var(--color-accent)] [--badge-fg:var(--color-fg-on-accent)]",
      danger:
        "[--badge-color:var(--color-danger)] [--badge-fg:var(--color-fg-on-danger)]",
      success:
        "[--badge-color:var(--color-success)] [--badge-fg:var(--color-fg-on-success)]",
      warning:
        "[--badge-color:var(--color-warning)] [--badge-fg:var(--color-fg-on-warning)]",
      info: "[--badge-color:var(--color-info)] [--badge-fg:var(--color-fg-on-info)]",
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
