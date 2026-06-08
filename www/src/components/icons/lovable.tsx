import type { SVGProps } from "react";

// Official Lovable (lovable.dev) mark, via svgl — the geometric heart. Brand uses a
// pink→orange gradient; rendered here in `currentColor` to tint with the text.
export function LovableIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 121 122" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M36.0687 0C55.9888 0 72.1373 16.1551 72.1373 36.0835V49.7975H84.141C104.061 49.7975 120.21 65.9526 120.21 85.8809C120.21 105.809 104.061 121.964 84.141 121.964H0V36.0835C0 16.1551 16.1485 0 36.0687 0Z"
			/>
		</svg>
	);
}
