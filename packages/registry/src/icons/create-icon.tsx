"use client";

import * as React from "react";

import { useStyleConfig } from "@dotui/core/react";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { createIconLoader } from "./create-icon-loader";

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

// Create loaders for each library (cached, created once)
const loaders = {
	hugeicons: createIconLoader("hugeicons"),
	tabler: createIconLoader("tabler"),
	remix: createIconLoader("remix"),
};

type IconNames = {
	lucide: string;
	hugeicons: string;
	tabler: string;
	remix: string;
};

export type { CommonIconProps };

export function createIcon(LucideIcon: IconComponent, names: IconNames): IconComponent {
	const IconComponent: IconComponent = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
		const styleConfig = useStyleConfig();

		if (!styleConfig || styleConfig.icons.library === "lucide") {
			return <LucideIcon ref={ref} {...props} />;
		}

		const { icons } = styleConfig;
		const Loader = loaders[icons.library as keyof typeof loaders];
		const iconName = names[icons.library as keyof typeof names];

		return (
			<React.Suspense
				fallback={
					<Skeleton>
						<LucideIcon ref={ref} {...props} />
					</Skeleton>
				}
			>
				<Loader name={iconName} {...props} />
			</React.Suspense>
		);
	});

	return IconComponent;
}
