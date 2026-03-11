import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
	base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 font-medium text-xs [&>svg]:pointer-events-none",
	variants: {
		variant: {
			default: "bg-neutral text-fg-on-neutral",
			primary: "bg-primary text-fg-on-primary",
			danger: "bg-danger text-fg-on-danger",
			success: "bg-success text-fg-on-success",
			warning: "bg-warning text-fg-on-warning",
			info: "bg-info text-fg-on-info",
		},
		size: {
			sm: "px-1.5 py-0.25 [&>svg]:size-3",
			md: "px-2 py-0.5 [&>svg]:size-3",
			lg: "px-2.5 py-0.75 [&>svg]:size-3",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeStyles> {}
const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
	return <span role="presentation" data-badge="" className={badgeStyles({ variant, size, className })} {...props} />;
};

export type { BadgeProps };
export { Badge };
