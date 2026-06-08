import type { SVGProps } from "react";

// bolt.new — the lightning-bolt mark. Simplified to a single monochrome glyph so
// it reads at small sizes and tints with `currentColor`. Swap for the official
// asset if/when it ships in the registry.
export function BoltIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M13.4 1.3a.7.7 0 0 1 1.27.5l-1.3 7.7H19a.7.7 0 0 1 .54 1.15l-9.94 11.9a.7.7 0 0 1-1.27-.5l1.3-7.7H5a.7.7 0 0 1-.54-1.15z" />
		</svg>
	);
}
