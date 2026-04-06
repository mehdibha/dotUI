"use client";

import { use } from "react";
import { useSlotId } from "@react-aria/utils";
import {
	Slider as AriaSlider,
	SliderOutput as AriaSliderOutput,
	SliderStateContext as AriaSliderStateContext,
	SliderThumb as AriaSliderThumb,
	SliderTrack as AriaSliderTrack,
	TextContext as AriaTextContext,
	composeRenderProps,
	Provider,
} from "react-aria-components";

import { useStyles } from "./styles";

// MARK: sliderStyles

// MARK: seperator

interface SliderProps extends React.ComponentProps<typeof AriaSlider> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
	const { root } = useStyles()();
	const descriptionId = useSlotId();
	return (
		<AriaSlider
			className={composeRenderProps(className, (cn, { orientation }) => root({ className: cn, orientation }))}
			aria-describedby={descriptionId}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<Provider values={[[AriaTextContext, { slot: "description", id: descriptionId }]]}>{children}</Provider>
			))}
		</AriaSlider>
	);
};

// MARK: seperator

interface SliderControlProps extends React.ComponentProps<typeof AriaSliderTrack> {}

const SliderControl = ({ className, ...props }: SliderControlProps) => {
	const { track } = useStyles()();
	return (
		<AriaSliderTrack
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
		</AriaSliderTrack>
	);
};

// MARK: seperator

interface SliderFillerProps extends React.ComponentProps<"div"> {}

const SliderFiller = ({ className, style, ...props }: SliderFillerProps) => {
	const { filler } = useStyles()();
	const { orientation, getThumbPercent, values, isDisabled } = use(AriaSliderStateContext)!;

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

// MARK: seperator

interface SliderThumbProps extends React.ComponentProps<typeof AriaSliderThumb> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
	const { thumb } = useStyles()();
	return (
		<AriaSliderThumb
			data-slot="slider-thumb"
			className={composeRenderProps(className, (className, { state: { orientation } }) =>
				thumb({ orientation, className }),
			)}
			{...props}
		/>
	);
};

// MARK: seperator

interface SliderOutputProps extends React.ComponentProps<typeof AriaSliderOutput> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
	const { output } = useStyles()();
	return (
		<AriaSliderOutput
			data-slot="slider-output"
			className={composeRenderProps(className, (className) => output({ className }))}
			{...props}
		>
			{composeRenderProps(
				children,
				(children, { state }) => children ?? state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - "),
			)}
		</AriaSliderOutput>
	);
};

// MARK: seperator

export { Slider, SliderControl, SliderFiller, SliderThumb, SliderOutput };

export type { SliderProps, SliderControlProps, SliderFillerProps, SliderThumbProps, SliderOutputProps };
