import type {
  DropZone as AriaDropZone,
  Text as AriaText,
} from "react-aria-components";

/**
 * A drop zone is an area into which one or multiple objects can be dragged and dropped.
 */
export interface DropZoneProps
  extends React.ComponentProps<typeof AriaDropZone> {}

/**
 * Missing description.
 */
export interface DropZoneLabelProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
