"use client";

import { useContext } from "react";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SliderPrimitive from "react-aria-components/Slider";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";
import { useSlotId } from "react-aria/private/utils/useId";

import { useStyles } from "./styles";

// MARK: sliderStyles

// MARK: Separator

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Slider> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
	const { root } = useStyles()();
	const descriptionId = useSlotId();
	return (
		<SliderPrimitive.Slider
			data-slider=""
			className={composeRenderProps(className, (cn, { orientation }) => root({ className: cn, orientation }))}
			aria-describedby={descriptionId}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<Provider values={[[TextPrimitives.TextContext, { slot: "description", id: descriptionId }]]}>
					{children}
				</Provider>
			))}
		</SliderPrimitive.Slider>
	);
};

// MARK: Separator

interface SliderControlProps extends React.ComponentProps<typeof SliderPrimitive.SliderTrack> {}

const SliderControl = ({ children, className, ...props }: SliderControlProps) => {
	const { control } = useStyles()();
	return (
		<SliderPrimitive.SliderTrack
			data-slider-control=""
			className={composeRenderProps(className, (cn, { orientation }) => control({ orientation, className: cn }))}
			{...props}
		>
			{composeRenderProps(
				children,
				(children, { state }) =>
					children ?? (
						<>
							<SliderTrack>
								<SliderFill />
							</SliderTrack>
							{state.values.map((_, i) => (
								<SliderThumb key={i} index={i} />
							))}
						</>
					),
			)}
		</SliderPrimitive.SliderTrack>
	);
};

// MARK: Separator

interface SliderTrackProps extends React.ComponentProps<"div"> {}

const SliderTrack = ({ className, ...props }: SliderTrackProps) => {
	const { track } = useStyles()();
	const state = useContext(SliderPrimitive.SliderStateContext);

	return (
		<div
			{...props}
			data-rac=""
			data-slider-track=""
			data-orientation={state?.orientation}
			data-disabled={state?.isDisabled || undefined}
			className={track({ orientation: state?.orientation, className })}
		/>
	);
};

// MARK: Separator

interface SliderFillProps extends React.ComponentProps<typeof SliderPrimitive.SliderFill> {}

const SliderFill = ({ className, ...props }: SliderFillProps) => {
	const { fill } = useStyles()();

	return (
		<SliderPrimitive.SliderFill
			data-slider-fill=""
			className={composeRenderProps(className, (className, { orientation }) => fill({ orientation, className }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface SliderThumbProps extends React.ComponentProps<typeof SliderPrimitive.SliderThumb> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
	const { thumb } = useStyles()();

	return (
		<SliderPrimitive.SliderThumb
			data-slider-thumb=""
			className={composeRenderProps(className, (className, { state: { orientation } }) =>
				thumb({ orientation, className }),
			)}
			{...props}
		/>
	);
};

// MARK: Separator

interface SliderOutputProps extends React.ComponentProps<typeof SliderPrimitive.SliderOutput> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
	const { output } = useStyles()();
	return (
		<SliderPrimitive.SliderOutput
			data-slider-output=""
			className={composeRenderProps(className, (className) => output({ className }))}
			{...props}
		>
			{composeRenderProps(
				children,
				(children, { state }) => children ?? state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - "),
			)}
		</SliderPrimitive.SliderOutput>
	);
};

// MARK: Separator

export type { SliderControlProps, SliderFillProps, SliderOutputProps, SliderProps, SliderThumbProps, SliderTrackProps };
export { Slider, SliderControl, SliderFill, SliderOutput, SliderThumb, SliderTrack };
