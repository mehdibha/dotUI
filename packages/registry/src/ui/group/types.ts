import type { Group as AriaGroup } from "react-aria-components";

export interface GroupProps extends React.ComponentProps<typeof AriaGroup> {
  /**
   * The orientation of the group layout.
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
}
