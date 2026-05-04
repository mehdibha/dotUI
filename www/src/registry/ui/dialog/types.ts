import type * as DialogPrimitives from "react-aria-components/Dialog";
import type * as HeadingPrimitives from "react-aria-components/Heading";
import type * as TextPrimitives from "react-aria-components/Text";

/**
 * A DialogTrigger opens a dialog when a trigger element is pressed.
 */
export interface DialogProps extends React.ComponentProps<typeof DialogPrimitives.DialogTrigger> {}

/**
 * A dialog is an overlay shown above other content in an application.
 */
export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitives.Dialog> {}

/**
 * Missing description.
 */
export interface DialogHeaderProps extends React.ComponentProps<"header"> {}

/**
 * Missing description.
 */
export interface DialogTitleProps extends React.ComponentProps<typeof HeadingPrimitives.Heading> {}

/**
 * Missing description.
 */
export interface DialogDescriptionProps extends Omit<React.ComponentProps<typeof TextPrimitives.Text>, "slot"> {}

/**
 * Missing description.
 */
export interface DialogBodyProps extends React.ComponentProps<"div"> {
	/**
	 * Whether to render the body with scroll edge fade masks.
	 */
	scrollFade?: boolean;
}

/**
 * Missing description.
 */
export interface DialogFooterProps extends React.ComponentProps<"footer"> {}
