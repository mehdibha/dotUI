import type * as SliderPrimitives from "react-aria-components/Slider";

/**
 * A slider allows a user to select one or more values within a range.
 */
export interface SliderProps extends React.ComponentProps<typeof SliderPrimitives.Slider> {}

/**
 * A slider track is a container for one or more slider thumbs.
 */
export interface SliderControlProps extends React.ComponentProps<typeof SliderPrimitives.SliderTrack> {}

/**
 * Missing description.
 */
export interface SliderFillerProps extends React.ComponentProps<"div"> {}

/**
 * A slider thumb represents an individual value that the user can adjust within a slider track.
 */
export interface SliderThumbProps extends React.ComponentProps<typeof SliderPrimitives.SliderThumb> {}

/**
 * A slider output displays the current value of a slider as text.
 */
export interface SliderOutputProps extends React.ComponentProps<typeof SliderPrimitives.SliderOutput> {}
