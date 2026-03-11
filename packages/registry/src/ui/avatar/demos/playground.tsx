"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@dotui/registry/ui/avatar";

interface AvatarPlaygroundProps {
	src?: string;
	alt?: string;
	fallback?: string;
	size?: "sm" | "md" | "lg";
}

export function AvatarPlayground({
	src = "https://github.com/mehdibha.png",
	alt = "@mehdibha",
	fallback = "MB",
	size = "md",
}: AvatarPlaygroundProps) {
	return (
		<Avatar size={size}>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	);
}
