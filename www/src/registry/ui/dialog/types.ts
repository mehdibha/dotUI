import * as DialogPrimitives from "react-aria-components/Dialog";
import * as HeadingPrimitives from "react-aria-components/Heading";
import * as TextPrimitives from "react-aria-components/Text";

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
export interface DialogHeadingProps extends React.ComponentProps<typeof HeadingPrimitives.Heading> {}

/**
 * Missing description.
 */
export interface DialogDescriptionProps extends Omit<React.ComponentProps<typeof TextPrimitives.Text>, "slot"> {}

/**
 * Missing description.
 */
export interface DialogBodyProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface DialogFooterProps extends React.ComponentProps<"footer"> {}

/**
 * Missing description.
 */
export interface DialogInsetProps extends React.ComponentProps<"div"> {}
