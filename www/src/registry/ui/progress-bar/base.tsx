"use client";

import { ProgressBar as AriaProgress, composeRenderProps } from "react-aria-components";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { createScopedContext } from "@/registry/lib/context";

import { useStyles } from "./styles";
import type { ProgressBarStyles } from "./styles";

// MARK: progressBarStyles

const [ProgressBarProvider, useProgressBarContext] = createScopedContext<
	VariantProps<ProgressBarStyles> & {
		isIndeterminate: boolean;
		valueText?: string;
		percentage?: number;
	}
>("ProgressRoot");

interface ProgressBarProps extends React.ComponentProps<typeof AriaProgress> {}

const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
	const { root } = useStyles()();
	return (
		<AriaProgress className={composeRenderProps(className, (className) => root({ className }))} {...props}>
			{composeRenderProps(children, (children, { isIndeterminate, valueText, percentage }) => (
				<ProgressBarProvider isIndeterminate={isIndeterminate} valueText={valueText} percentage={percentage}>
					{children ?? <ProgressBarControl />}
				</ProgressBarProvider>
			))}
		</AriaProgress>
	);
};

// MARK: seperator

interface ProgressBarControlProps extends React.ComponentProps<"div">, VariantProps<ProgressBarStyles> {
	duration?: `${number}s` | `${number}ms`;
}

const ProgressBarControl = ({ className, variant, size, duration, ...props }: ProgressBarControlProps) => {
	const { indicator, filler } = useStyles()();
	const { isIndeterminate, percentage } = useProgressBarContext("ProgressBarControl");

	return (
		<div className={indicator({ variant, size, className })} {...props}>
			<div
				data-rac=""
				data-indeterminate={isIndeterminate || undefined}
				className={filler({ variant, size })}
				style={
					{
						"--progress-duration": duration,
						transform: percentage ? `scaleX(${percentage / 100})` : undefined,
					} as React.CSSProperties
				}
			/>
		</div>
	);
};

// MARK: seperator

interface ProgressBarValueLabelProps extends React.ComponentProps<"span"> {}
const ProgressBarValueLabel = ({ className, ...props }: ProgressBarValueLabelProps) => {
	const { valueLabel } = useStyles()();
	const { valueText } = useProgressBarContext("ProgressBarValueLabel");

	return (
		<span className={valueLabel({ className })} {...props}>
			{valueText}
		</span>
	);
};

// MARK: seperator

export type { ProgressBarControlProps, ProgressBarProps, ProgressBarValueLabelProps };
export { ProgressBar, ProgressBarControl, ProgressBarValueLabel };
