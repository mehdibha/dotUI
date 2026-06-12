/**
 * An empty state displays a placeholder message and optional actions when there is no content to show.
 */
export interface EmptyProps extends React.ComponentProps<'div'> {}

/**
 * Contains the media, title, and description of the empty state.
 */
export interface EmptyHeaderProps extends React.ComponentProps<'div'> {}

/**
 * The main heading of the empty state.
 */
export interface EmptyTitleProps extends React.ComponentProps<'div'> {}

/**
 * Supporting text that explains the empty state or how to resolve it.
 */
export interface EmptyDescriptionProps extends React.ComponentProps<'div'> {}

/**
 * Contains the actions and supplementary content of the empty state, such as buttons or links.
 */
export interface EmptyContentProps extends React.ComponentProps<'div'> {}

/**
 * The visual media of the empty state, such as an icon, image, or avatar.
 */
export interface EmptyMediaProps extends React.ComponentProps<'div'> {
  /**
   * The visual style of the media container.
   * @default 'default'
   */
  variant?: 'default' | 'icon'
}
