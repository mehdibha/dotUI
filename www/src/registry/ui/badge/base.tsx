import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import type { BadgeStyles } from "./styles";
import { useStyles } from "./styles";

// MARK: badgeStyles

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<BadgeStyles> {}
const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
	const badgeStyles = useStyles();
	return <span role="presentation" data-badge="" className={badgeStyles({ variant, size, className })} {...props} />;
};

export type { BadgeProps };
export { Badge };
