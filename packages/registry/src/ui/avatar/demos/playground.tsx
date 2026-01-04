"use client";

import { Avatar } from "@dotui/registry/ui/avatar";

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
	return <Avatar src={src} alt={alt} fallback={fallback} size={size} />;
}
