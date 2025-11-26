export interface EmptyProps extends React.ComponentProps<"div"> {}

export interface EmptyHeaderProps extends React.ComponentProps<"div"> {}

export interface EmptyTitleProps extends React.ComponentProps<"div"> {}

export interface EmptyDescriptionProps extends React.ComponentProps<"div"> {}

export interface EmptyContentProps extends React.ComponentProps<"div"> {}

export interface EmptyMediaProps extends React.ComponentProps<"div"> {
  /**
   * The visual style of the media container.
   * @default 'default'
   */
  variant?: "default" | "icon";
}

