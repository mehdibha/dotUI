import type { SVGProps } from "react";

export function ShadcnIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
			<rect fill="none" width="256" height="256" />
			<line
				fill="none"
				className="stroke-fg"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="32"
				x1="208"
				y1="128"
				x2="128"
				y2="208"
			/>
			<line
				fill="none"
				className="stroke-fg"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="32"
				x1="192"
				y1="40"
				x2="40"
				y2="192"
			/>
		</svg>
	);
}
