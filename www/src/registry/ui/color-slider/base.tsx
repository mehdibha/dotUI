"use client";

import { useSlotId } from "@react-aria/utils";
import {
	ColorSlider as AriaColorSlider,
	SliderOutput as AriaSliderOutput,
	SliderTrack as AriaSliderTrack,
	composeRenderProps,
	Provider,
	TextContext,
} from "react-aria-components";

import { ColorThumb } from "@/registry/ui/color-thumb";

import { useStyles } from "./styles";

// MARK: colorSliderStyles

// MARK: seperator

interface ColorSliderProps extends React.ComponentProps<typeof AriaColorSlider> {}

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
	const { root } = useStyles()();
	const descriptionId = useSlotId();
	return (
		<Provider values={[[TextContext, { slot: "description", id: descriptionId }]]}>
			<AriaColorSlider
				className={composeRenderProps(className, (cn, { orientation }) => root({ orientation, className: cn }))}
				aria-describedby={descriptionId}
				{...props}
			>
				{props.children ?? <ColorSliderControl />}
			</AriaColorSlider>
		</Provider>
	);
};

// MARK: seperator

interface ColorSliderControlProps extends React.ComponentProps<typeof AriaSliderTrack> {}

const ColorSliderControl = ({ className, ...props }: ColorSliderControlProps) => {
	const { track } = useStyles()();
	return (
		<AriaSliderTrack
			data-slot="color-slider-control"
			className={composeRenderProps(className, (cn, { orientation }) => track({ orientation, className: cn }))}
			{...props}
		>
			{props.children ?? <ColorThumb />}
		</AriaSliderTrack>
	);
};

// MARK: seperator

interface ColorSliderOutputProps extends React.ComponentProps<typeof AriaSliderOutput> {}

const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
	const { output } = useStyles()();
	return (
		<AriaSliderOutput className={composeRenderProps(className, (className) => output({ className }))} {...props} />
	);
};

// MARK: seperator

export { ColorSlider, ColorSliderControl, ColorSliderOutput };

export type { ColorSliderProps, ColorSliderControlProps, ColorSliderOutputProps };
