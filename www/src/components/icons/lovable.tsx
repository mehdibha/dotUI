import type { SVGProps } from "react";

// Official Lovable (lovable.dev) mark, via svgl — the geometric heart, in its real
// brand gradient (warm coral → pink → blue). Self-colored, so it ignores currentColor.
export function LovableIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 121 122" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fill="url(#lovable-gradient)"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M36.069 0c19.92 0 36.068 16.155 36.068 36.084v13.713h12.004c19.92 0 36.069 16.156 36.069 36.084 0 19.928-16.149 36.083-36.069 36.083H0v-85.88C0 16.155 16.148 0 36.069 0Z"
			/>
			<defs>
				<linearGradient
					id="lovable-gradient"
					x1="40.453"
					y1="21.433"
					x2="76.933"
					y2="121.971"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0.025" stopColor="#FF8E63" />
					<stop offset="0.56" stopColor="#FF7EB0" />
					<stop offset="0.95" stopColor="#4B73FF" />
				</linearGradient>
			</defs>
		</svg>
	);
}
