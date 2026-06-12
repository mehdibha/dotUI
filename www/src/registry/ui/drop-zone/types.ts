import type * as DropZonePrimitives from 'react-aria-components/DropZone'
import type * as TextPrimitives from 'react-aria-components/Text'

/**
 * A drop zone is an area into which one or multiple objects can be dragged and dropped.
 */
export interface DropZoneProps extends React.ComponentProps<
  typeof DropZonePrimitives.DropZone
> {}

/**
 * The label of the drop zone, used as its accessible name.
 */
export interface DropZoneLabelProps extends Omit<
  React.ComponentProps<typeof TextPrimitives.Text>,
  'slot'
> {}
