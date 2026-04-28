"use client";

import { use } from "react";
import { useSlotId } from "react-aria/private/utils/useId";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SliderPrimitives from "react-aria-components/Slider";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";

import { useStyles } from "./styles";

// MARK: sliderStyles

// MARK: Separator

interface SliderProps extends React.ComponentProps<typeof SliderPrimitives.Slider> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
	const { root } = useStyles()();
	const descriptionId = useSlotId();
	return (
		<SliderPrimitives.Slider
			className={composeRenderProps(className, (cn, { orientation }) => root({ className: cn, orientation }))}
			aria-describedby={descriptionId}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<Provider values={[[TextPrimitives.TextContext, { slot: "description", id: descriptionId }]]}>
					{children}
				</Provider>
			))}
		</SliderPrimitives.Slider>
	);
};

// MARK: Separator

interface SliderControlProps extends React.ComponentProps<typeof SliderPrimitives.SliderTrack> {}

const SliderControl = ({ className, ...props }: SliderControlProps) => {
	const { track } = useStyles()();
	return (
		<SliderPrimitives.SliderTrack
			data-slot="slider-track"
			data-slider-track=""
			data-slider-control=""
			className={composeRenderProps(className, (cn, { orientation }) => track({ orientation, className: cn }))}
			{...props}
		>
			{composeRenderProps(
				props.children,
				(children, { state }) =>
					children ?? (
						<>
							{state.values.length < 3 && <SliderFiller />}
							{state.values.map((_, i) => (
								<SliderThumb key={i} index={i} />
							))}
						</>
					),
			)}
		</SliderPrimitives.SliderTrack>
	);
};

// MARK: Separator

interface SliderFillerProps extends React.ComponentProps<"div"> {}

const SliderFiller = ({ className, style, ...props }: SliderFillerProps) => {
	const { filler } = useStyles()();
	const { orientation, getThumbPercent, values, isDisabled } = use(SliderPrimitives.SliderStateContext)!;

	const getFillerDimensions = (): React.CSSProperties => {
		if (values.length === 1 && orientation === "horizontal") return { width: `${getThumbPercent(0) * 100}%` };

		if (values.length === 1 && orientation === "vertical") return { height: `${getThumbPercent(0) * 100}%` };

		if (orientation === "horizontal")
			return {
				left: `${getThumbPercent(0) * 100}%`,
				width: `${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%`,
			};

		return {
			bottom: `${getThumbPercent(0) * 100}%`,
			height: `${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%`,
		};
	};

	return (
		<div
			data-slot="slider-filler"
			data-rac=""
			data-disabled={isDisabled || undefined}
			className={filler({ orientation, className })}
			style={{ ...style, ...getFillerDimensions() }}
			{...props}
		/>
	);
};

// MARK: Separator

interface SliderThumbProps extends React.ComponentProps<typeof SliderPrimitives.SliderThumb> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
	const { thumb } = useStyles()();
	return (
		<SliderPrimitives.SliderThumb
			data-slot="slider-thumb"
			className={composeRenderProps(className, (className, { state: { orientation } }) =>
				thumb({ orientation, className }),
			)}
			{...props}
		/>
	);
};

// MARK: Separator

interface SliderOutputProps extends React.ComponentProps<typeof SliderPrimitives.SliderOutput> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
	const { output } = useStyles()();
	return (
		<SliderPrimitives.SliderOutput
			data-slot="slider-output"
			className={composeRenderProps(className, (className) => output({ className }))}
			{...props}
		>
			{composeRenderProps(
				children,
				(children, { state }) => children ?? state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - "),
			)}
		</SliderPrimitives.SliderOutput>
	);
};

// MARK: Separator

export type { SliderControlProps, SliderFillerProps, SliderOutputProps, SliderProps, SliderThumbProps };
export { Slider, SliderControl, SliderFiller, SliderOutput, SliderThumb };
