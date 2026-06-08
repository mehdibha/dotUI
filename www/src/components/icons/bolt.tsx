import type { SVGProps } from "react";

// bolt.new (StackBlitz) — the lightning glyph from the official mark, in `currentColor`
// so it tints with the surrounding text. (The full brand lockup wraps this bolt in a
// rounded square; the glyph alone reads better inline and balances the other marks.)
export function BoltIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M7.398 9.091h-3.58L10.364 2 8.602 6.909h3.58L5.636 14l1.762-4.909Z" />
		</svg>
	);
}
