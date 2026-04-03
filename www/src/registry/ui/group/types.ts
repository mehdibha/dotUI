import type { Group as AriaGroup } from "react-aria-components";

/**
 * A group represents a set of related UI controls, and supports interactive states for styling.
 */
export interface GroupProps extends React.ComponentProps<typeof AriaGroup> {
	/**
	 * The orientation of the group layout.
	 * @default 'horizontal'
	 */
	orientation?: "horizontal" | "vertical";
}
