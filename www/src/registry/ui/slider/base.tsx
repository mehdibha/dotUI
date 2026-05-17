"use client";

import { use } from "react";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SliderPrimitives from "react-aria-components/Slider";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";
import { useSlotId } from "react-aria/private/utils/useId";

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

interface SliderTrackProps extends React.ComponentProps<typeof SliderPrimitives.SliderTrack> {}

const SliderTrack = ({ className, ...props }: SliderTrackProps) => {
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
							{state.values.length < 3 && <SliderFill />}
							{state.values.map((_, i) => (
								// oxlint-disable-next-line react/no-array-index-key -- React Aria identifies slider thumbs by index.
								<SliderThumb key={i} index={i} />
							))}
						</>
					),
			)}
		</SliderPrimitives.SliderTrack>
	);
};

// MARK: Separator

interface SliderFillProps extends React.ComponentProps<"div"> {}

const SliderFill = ({ className, style, ...props }: SliderFillProps) => {
	const { fill } = useStyles()();
	const sliderState = use(SliderPrimitives.SliderStateContext);
	if (!sliderState) return null;

	const { orientation, getThumbPercent, values, isDisabled } = sliderState;

	const getFillDimensions = (): React.CSSProperties => {
		if (values.length === 1 && orientation === "horizontal")
			return { insetInlineStart: "0%", width: `${getThumbPercent(0) * 100}%` };

		if (values.length === 1 && orientation === "vertical")
			return { bottom: "0%", height: `${getThumbPercent(0) * 100}%` };

		const start = getThumbPercent(0);
		const end = getThumbPercent(1);
		const offset = Math.min(start, end) * 100;
		const size = Math.abs(start - end) * 100;

		if (orientation === "horizontal")
			return {
				insetInlineStart: `${offset}%`,
				width: `${size}%`,
			};

		return {
			bottom: `${offset}%`,
			height: `${size}%`,
		};
	};

	return (
		<div
			data-slot="slider-fill"
			data-rac=""
			data-disabled={isDisabled || undefined}
			data-slider-fill=""
			data-slider-filler=""
			className={fill({ orientation, className })}
			style={{ ...style, ...getFillDimensions() }}
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

type SliderControlProps = SliderTrackProps;
type SliderFillerProps = SliderFillProps;

const SliderControl = SliderTrack;
const SliderFiller = SliderFill;

// MARK: Separator

export type {
	SliderControlProps,
	SliderFillProps,
	SliderFillerProps,
	SliderOutputProps,
	SliderProps,
	SliderThumbProps,
	SliderTrackProps,
};
export { Slider, SliderControl, SliderFill, SliderFiller, SliderOutput, SliderThumb, SliderTrack };
