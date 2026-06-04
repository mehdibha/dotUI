"use client";

import { Input, type InputProps } from "@/registry/ui/input";

export default function Demo({
	placeholder = "Enter text...",
	size = "md",
	disabled = false,
	readOnly = false,
}: InputProps = {}) {
	return <Input placeholder={placeholder} size={size} disabled={disabled} readOnly={readOnly}></Input>;
}
