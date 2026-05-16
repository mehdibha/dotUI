"use client";

import { useRef } from "react";
import type * as React from "react";

import { mergeRefs } from "react-aria/mergeRefs";

import { useStyles } from "./styles";
import { useScrollFade } from "./use-scroll-fade";

// MARK: scrollFadeStyles

interface ScrollFadeProps extends React.ComponentProps<"div"> {}

function ScrollFade({ ref: forwardedRef, className, ...props }: ScrollFadeProps) {
	const scrollFadeStyles = useStyles();

	const ref = useRef<HTMLDivElement>(null);
	useScrollFade({ ref });

	return (
		<div
			ref={mergeRefs(forwardedRef, ref)}
			data-slot="scroll-fade"
			role="presentation"
			className={scrollFadeStyles({ className })}
			{...props}
		/>
	);
}

export type { ScrollFadeProps };
export { ScrollFade };
