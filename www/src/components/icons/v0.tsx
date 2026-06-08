import type { SVGProps } from "react";

// The v0 wordmark (renders the "v0" glyph). Inherits `currentColor`.
export function V0Icon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 40 20" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M23.94 9.06v6.51c0 .47.38.85.85.85h.94v3.08h-1.27a3.46 3.46 0 0 1-3.46-3.46c-1.05 1.2-2.6 1.96-4.32 1.96a5.74 5.74 0 1 1 5.74-5.74l-.01.05h.01v-3.2h1.57zm-7.26 9.07a2.66 2.66 0 1 0 0-5.32 2.66 2.66 0 0 0 0 5.32z" />
			<path
				d="M8.06 5.73 3.3 14.4h9.52L8.06 5.73zm0-4.6 8.06 14.7H0L8.06 1.13z"
				transform="translate(0 1.5) scale(.78)"
			/>
		</svg>
	);
}
