import type {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Text as AriaText,
} from "react-aria-components";

/**
 * A DialogTrigger opens a dialog when a trigger element is pressed.
 */
export interface DialogProps
  extends React.ComponentProps<typeof AriaDialogTrigger> {}

/**
 * A dialog is an overlay shown above other content in an application.
 */
export interface DialogContentProps
  extends React.ComponentProps<typeof AriaDialog> {}

/**
 * Missing description.
 */
export interface DialogHeaderProps extends React.ComponentProps<"header"> {}

/**
 * Missing description.
 */
export interface DialogHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}

/**
 * Missing description.
 */
export interface DialogDescriptionProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}

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
