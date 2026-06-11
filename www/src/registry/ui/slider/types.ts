import type * as SliderPrimitives from 'react-aria-components/Slider'

/**
 * A slider allows a user to select one or more values within a range.
 */
export interface SliderProps extends React.ComponentProps<
  typeof SliderPrimitives.Slider
> {}

/**
 * A slider control is the interactive surface that positions the track and thumbs.
 */
export interface SliderControlProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderTrack
> {}

/**
 * A slider track is the visual track that contains the selected fill.
 */
export interface SliderTrackProps extends React.ComponentProps<'div'> {}

/**
 * A slider fill displays the selected region of the track.
 */
export interface SliderFillProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderFill
> {}

/**
 * A slider thumb represents an individual value that the user can adjust within a slider track.
 */
export interface SliderThumbProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderThumb
> {}

/**
 * A slider output displays the current value of a slider as text.
 */
export interface SliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderOutput
> {}
