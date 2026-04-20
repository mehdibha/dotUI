"use client";

import { Input } from "@/registry/ui/input";

interface InputPlaygroundProps {
	placeholder?: string;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	readOnly?: boolean;
}

export function InputPlayground({ placeholder = "Enter text...", ...props }: InputPlaygroundProps) {
	return <Input placeholder={placeholder} {...props} />;
}
