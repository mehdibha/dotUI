/**
 * Hand-authored macOS-style cursor glyphs. Filled shapes use the foreground colour with a
 * background-coloured outline (the classic black-cursor / white-halo look, theme-adaptive);
 * symbol cursors (text, crosshair, not-allowed) are drawn as strokes.
 */

import type { ReactElement, ReactNode } from "react";

const FILL = "var(--color-fg)";
const HALO = "var(--color-bg)";

function Glyph({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<svg viewBox="0 0 20 20" aria-hidden className={className}>
			{children}
		</svg>
	);
}

/** Filled cursor body with a halo outline. */
function Filled({ d }: { d: string }) {
	return <path d={d} fill={FILL} stroke={HALO} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />;
}

/** Thin stroked symbol in the foreground colour. */
function Stroked({ children }: { children: ReactNode }) {
	return (
		<g fill="none" stroke={FILL} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
			{children}
		</g>
	);
}

const ARROW_D = "M4 2.5 L4 16.6 L7.7 13 L10.1 17.9 L12.3 16.8 L9.9 12 L14.7 12 Z";
const POINTER_D =
	"M6.4 10.4 L6.4 4.9 C6.4 3.7 8 3.7 8 4.9 L8 9.2 L8 8.1 C8 7.3 9.4 7.3 9.4 8.1 L9.4 9.4 L9.4 8.7 C9.4 8 10.7 8 10.7 8.7 L10.7 9.6 L10.7 9.2 C10.7 8.5 12 8.5 12 9.2 L12 13.6 C12 15.8 10.6 17.3 8.5 17.3 L7.6 17.3 C6.4 17.3 5.6 16.7 5 15.7 L3.6 13.3 C3.1 12.4 4.4 11.5 5.1 12.3 L6.4 13.9 Z";
const GRAB_D =
	"M5.6 11 L5.6 7.2 C5.6 6.5 6.7 6.5 6.7 7.2 L6.7 10 L7.2 10 L7.2 6.1 C7.2 5.4 8.3 5.4 8.3 6.1 L8.3 10 L8.8 10 L8.8 5.9 C8.8 5.2 9.9 5.2 9.9 5.9 L9.9 10 L10.4 10 L10.4 6.6 C10.4 5.9 11.5 5.9 11.5 6.6 L11.5 11.5 C11.5 14.5 10 16.5 7.8 16.5 C6.5 16.5 5.6 15.9 4.8 14.6 L3.7 12.7 C3.3 12 4.3 11.4 4.8 12 Z";

const GLYPHS: Record<string, (className?: string) => ReactElement> = {
	default: (c) => (
		<Glyph className={c}>
			<Filled d={ARROW_D} />
		</Glyph>
	),
	pointer: (c) => (
		<Glyph className={c}>
			<Filled d={POINTER_D} />
		</Glyph>
	),
	grab: (c) => (
		<Glyph className={c}>
			<Filled d={GRAB_D} />
		</Glyph>
	),
	move: (c) => (
		<Glyph className={c}>
			<Filled d="M10 2.4 L12.3 4.9 H10.9 V9.1 H15.1 V7.7 L17.6 10 L15.1 12.3 V10.9 H10.9 V15.1 H12.3 L10 17.6 L7.7 15.1 H9.1 V10.9 H4.9 V12.3 L2.4 10 L4.9 7.7 V9.1 H9.1 V4.9 H7.7 Z" />
		</Glyph>
	),
	text: (c) => (
		<Glyph className={c}>
			<Stroked>
				<path d="M8 3.5 H12 M10 3.5 V16.5 M8 16.5 H12" />
			</Stroked>
		</Glyph>
	),
	"not-allowed": (c) => (
		<Glyph className={c}>
			<Stroked>
				<circle cx="10" cy="10" r="6.6" />
				<path d="M5.3 5.3 L14.7 14.7" />
			</Stroked>
		</Glyph>
	),
	crosshair: (c) => (
		<Glyph className={c}>
			<Stroked>
				<path d="M10 2.5 V7.5 M10 12.5 V17.5 M2.5 10 H7.5 M12.5 10 H17.5" />
			</Stroked>
		</Glyph>
	),
	wait: (c) => (
		<Glyph className={c}>
			<Stroked>
				<circle cx="10" cy="10" r="6.6" />
				<path d="M10 6.2 V10 L12.6 11.6" />
			</Stroked>
		</Glyph>
	),
	help: (c) => (
		<Glyph className={c}>
			<Filled d="M3.5 2.5 L3.5 13.5 L6.4 10.6 L8.3 14.6 L10 13.7 L8.1 9.8 L12 9.8 Z" />
			<Stroked>
				<path d="M12.5 12 C12.5 10.8 14.4 10.8 14.4 12.2 C14.4 13.2 13.4 13.1 13.4 14.1 M13.4 16 L13.41 16" />
			</Stroked>
		</Glyph>
	),
	progress: (c) => (
		<Glyph className={c}>
			<Filled d="M3.5 2.5 L3.5 13.5 L6.4 10.6 L8.3 14.6 L10 13.7 L8.1 9.8 L12 9.8 Z" />
			<Stroked>
				<path d="M14 10.2 A3 3 0 1 1 11.2 8.2" />
			</Stroked>
		</Glyph>
	),
};

export function CursorGlyph({ value, className }: { value: string; className?: string }) {
	const render = GLYPHS[value] ?? GLYPHS.default;
	return render ? render(className) : null;
}
