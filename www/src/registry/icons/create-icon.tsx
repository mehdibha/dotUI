"use client";

import type * as React from "react";

interface CommonIconProps extends React.RefAttributes<SVGSVGElement> {
	className?: string;
	width?: string | number;
	height?: string | number;
	size?: string | number;
	style?: React.CSSProperties;
	fill?: string;
	stroke?: string;
	strokeWidth?: string | number;
	onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
	onMouseEnter?: (event: React.MouseEvent<SVGSVGElement>) => void;
	onMouseLeave?: (event: React.MouseEvent<SVGSVGElement>) => void;
	"aria-label"?: string;
	"aria-hidden"?: React.AriaAttributes["aria-hidden"];
	role?: string;
}

type IconComponent = React.ComponentType<CommonIconProps>;

type IconNames = {
	lucide: string;
	hugeicons: string;
	tabler: string;
	remix: string;
};

export type { CommonIconProps };

export function createIcon(LucideIcon: IconComponent, _names: IconNames): IconComponent {
	return LucideIcon;
}
