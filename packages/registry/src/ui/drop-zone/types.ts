import type {
  DropZone as AriaDropZone,
  Text as AriaText,
} from "react-aria-components";

export interface DropZoneProps
  extends React.ComponentProps<typeof AriaDropZone> {}

export interface DropZoneLabelProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
