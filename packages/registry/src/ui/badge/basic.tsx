import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
	base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 font-medium text-xs [&>svg]:pointer-events-none [&>svg]:size-3",
	variants: {
		variant: {
			default: "bg-neutral text-fg-on-neutral",
			danger: "bg-danger text-fg-on-danger",
			success: "bg-success text-fg-on-success",
			warning: "bg-warning text-fg-on-warning",
			info: "bg-info text-fg-on-info",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeStyles> {}
const Badge = ({ className, variant, ...props }: BadgeProps) => {
	return <span role="presentation" className={badgeStyles({ variant, className })} {...props} />;
};

export type { BadgeProps };
export { Badge };
