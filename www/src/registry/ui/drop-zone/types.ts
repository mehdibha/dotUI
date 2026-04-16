import * as DropZonePrimitives from "react-aria-components/DropZone";
import * as TextPrimitives from "react-aria-components/Text";

/**
 * A drop zone is an area into which one or multiple objects can be dragged and dropped.
 */
export interface DropZoneProps extends React.ComponentProps<typeof DropZonePrimitives.DropZone> {}

/**
 * Missing description.
 */
export interface DropZoneLabelProps extends Omit<React.ComponentProps<typeof TextPrimitives.Text>, "slot"> {}
