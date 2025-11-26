import type {
  DialogTrigger as AriaDialogTrigger,
  Dialog as AriaDialog,
  Heading as AriaHeading,
  Text as AriaText,
} from "react-aria-components";

export interface DialogProps
  extends React.ComponentProps<typeof AriaDialogTrigger> {}

export interface DialogContentProps
  extends React.ComponentProps<typeof AriaDialog> {}

export interface DialogHeaderProps extends React.ComponentProps<"header"> {}

export interface DialogHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}

export interface DialogDescriptionProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}

export interface DialogBodyProps extends React.ComponentProps<"div"> {}

export interface DialogFooterProps extends React.ComponentProps<"footer"> {}

export interface DialogInsetProps extends React.ComponentProps<"div"> {}

