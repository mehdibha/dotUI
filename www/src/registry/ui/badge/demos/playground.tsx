import { Badge, type BadgeProps } from "@/registry/ui/badge";

export default function Demo({ children = "Badge", variant = "neutral", appearance = "solid" }: BadgeProps = {}) {
	return (
		<Badge variant={variant} appearance={appearance}>
			{children}
		</Badge>
	);
}
