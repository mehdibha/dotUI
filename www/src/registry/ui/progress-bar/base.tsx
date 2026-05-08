"use client";

import { type ComponentProps, createContext, use } from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ProgressBarPrimitive from "react-aria-components/ProgressBar";

import { useStyles } from "./styles";

const ProgressBarContext = createContext<ProgressBarPrimitive.ProgressBarRenderProps | null>(null);
const useProgressBarContext = (componentName: string) => {
	const context = use(ProgressBarContext);
	if (!context) {
		throw new Error(`${componentName} must be used within a ProgressBar`);
	}
	return context;
};

// MARK: Separator

interface ProgressBarProps extends ComponentProps<typeof ProgressBarPrimitive.ProgressBar> {}
const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
	const { root } = useStyles()();
	return (
		<ProgressBarPrimitive.ProgressBar
			className={composeRenderProps(className, (className) => root({ className }))}
			{...props}
		>
			{composeRenderProps(children, (children, state) => (
				<ProgressBarContext value={state}>{children ?? <ProgressBarTrack />}</ProgressBarContext>
			))}
		</ProgressBarPrimitive.ProgressBar>
	);
};

// MARK: Separator

interface ProgressBarControlProps extends React.ComponentProps<"div"> {
	duration?: string;
	size?: "sm" | "md" | "lg";
	variant?: "primary" | "success" | "accent" | "danger" | "warning";
}
const ProgressBarTrack = ({
	children,
	className,
	duration,
	size,
	style,
	variant,
	...props
}: ProgressBarControlProps) => {
	const { track } = useStyles()();
	return (
		<div
			data-duration={duration}
			data-size={size}
			data-variant={variant}
			className={track({ className })}
			style={
				{
					"--progress-duration": duration,
					...style,
				} as React.CSSProperties
			}
			{...props}
		>
			{children ?? <ProgressBarFill />}
		</div>
	);
};

// MARK: Separator

interface ProgressBarFillProps extends React.ComponentProps<"div"> {}
const ProgressBarFill = ({ className, style, ...props }: ProgressBarFillProps) => {
	const { fill } = useStyles()();
	const { isIndeterminate, percentage } = useProgressBarContext("ProgressBarControl");

	return (
		<div
			data-rac=""
			data-indeterminate={isIndeterminate || undefined}
			className={fill({ className })}
			style={
				{
					transform: percentage ? `scaleX(${percentage / 100})` : undefined,
					...style,
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

// MARK: Separator

interface ProgressBarOutputProps extends React.ComponentProps<"span"> {}
const ProgressBarOutput = ({ className, ...props }: ProgressBarOutputProps) => {
	const { output } = useStyles()();
	const { valueText } = useProgressBarContext("ProgressBarValueLabel");

	return (
		<span className={output({ className })} {...props}>
			{valueText}
		</span>
	);
};

// MARK: Separator

const ProgressBarControl = ProgressBarTrack;
const ProgressBarValueLabel = ProgressBarOutput;

// MARK: Separator

export type { ProgressBarControlProps, ProgressBarFillProps, ProgressBarOutputProps, ProgressBarProps };
export { ProgressBar, ProgressBarControl, ProgressBarFill, ProgressBarOutput, ProgressBarTrack, ProgressBarValueLabel };
