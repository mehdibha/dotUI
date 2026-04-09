"use client";

import { Badge } from "@/registry/ui/badge";

interface BadgePlaygroundProps {
	children?: string;
	variant?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
}

export function BadgePlayground({ children = "Badge", variant }: BadgePlaygroundProps) {
	return <Badge variant={variant}>{children}</Badge>;
}
