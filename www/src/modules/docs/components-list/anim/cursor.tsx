"use client";

import { motion } from "motion/react";

import type { MotionValue } from "motion/react";

interface FakeCursorProps {
	x: MotionValue<number>;
	y: MotionValue<number>;
	scale: MotionValue<number>;
	opacity: MotionValue<number>;
	/** Click ripple trigger — increment to fire a ripple at the current position. */
	ripple: MotionValue<number>;
}

/**
 * A decorative pointer that the preview animations drive around the card. Purely
 * visual (pointer-events: none); the real interaction is faked via controlled
 * state, so this never steals real focus or pointer input.
 */
export function FakeCursor({ x, y, scale, opacity }: FakeCursorProps) {
	return (
		<motion.div
			aria-hidden
			className="pointer-events-none absolute top-0 left-0 z-50 will-change-transform"
			style={{ x, y, opacity }}
		>
			<motion.svg
				width="20"
				height="22"
				viewBox="0 0 20 22"
				fill="none"
				style={{ scale }}
				className="origin-top-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
			>
				{/* macOS-style arrow: white outline + dark fill so it reads on any theme */}
				<path
					d="M3.5 2.2 L3.5 16.4 L7.1 12.9 L9.5 18.6 L12.1 17.5 L9.7 11.9 L14.7 11.9 Z"
					fill="black"
					stroke="white"
					strokeWidth="1.4"
					strokeLinejoin="round"
				/>
			</motion.svg>
		</motion.div>
	);
}
