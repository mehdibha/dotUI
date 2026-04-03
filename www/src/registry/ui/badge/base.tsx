import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
	base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium text-xs [&>svg]:pointer-events-none",
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
			sm: "h-4.5 min-w-4.5 px-1.5 text-xs [&>svg]:size-2.5 **:data-loader:*:[svg]:size-2.5",
			md: "h-5 min-w-5 px-1.75 text-xs [&>svg]:size-3 **:data-loader:*:[svg]:size-3",
			lg: "h-5.5 min-w-5.5 px-2.25 text-xs [&>svg]:size-3.5 **:data-loader:*:[svg]:size-3.5",
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
