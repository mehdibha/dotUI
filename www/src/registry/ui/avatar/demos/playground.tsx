"use client";

import { Avatar, AvatarFallback, AvatarImage, type AvatarProps } from "@/registry/ui/avatar";

export default function Demo({
	src = "https://github.com/mehdibha.png",
	fallback = "MB",
	size = "md",
}: { src?: string; fallback?: string; size?: AvatarProps["size"] } = {}) {
	return (
		<Avatar size={size}>
			<AvatarImage data-control-target src={src} alt="@mehdibha" />
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	);
}
