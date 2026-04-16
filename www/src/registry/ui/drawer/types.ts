import * as ModalPrimitives from "react-aria-components/Modal";

/**
 * Missing description.
 */
export interface DrawerProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {
	/**
	 * The side of the screen where the drawer appears.
	 * @default 'bottom'
	 */
	placement?: "top" | "bottom" | "left" | "right";
}
