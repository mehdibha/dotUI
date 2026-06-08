import type { SVGProps } from "react";

// Lovable — the heart mark. Simplified to a single monochrome glyph so it reads at
// small sizes and tints with `currentColor`. Swap for the official asset if/when it
// ships in the registry.
export function LovableIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M12 21.1c-.36 0-.71-.13-.98-.37l-7.06-6.4C1.4 12.06.9 8.43 2.9 6.06A5.06 5.06 0 0 1 6.77 4.2c1.5 0 2.94.62 3.98 1.7l1.25 1.3 1.25-1.3a5.5 5.5 0 0 1 3.98-1.7c1.5 0 2.92.67 3.87 1.86 2 2.37 1.5 6-1.06 8.27l-7.06 6.4c-.27.24-.62.37-.98.37Z" />
		</svg>
	);
}
