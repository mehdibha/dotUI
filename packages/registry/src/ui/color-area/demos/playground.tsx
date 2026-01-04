"use client";

import { ColorArea } from "@dotui/registry/ui/color-area";

interface ColorAreaPlaygroundProps {
	isDisabled?: boolean;
}

export function ColorAreaPlayground({ isDisabled = false }: ColorAreaPlaygroundProps) {
	return <ColorArea defaultValue="#ff0000" isDisabled={isDisabled} />;
}
