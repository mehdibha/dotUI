/**
 * A card groups related content and actions into a single container.
 */
export interface CardProps extends React.ComponentProps<'div'> {}

/**
 * The header of the card. Contains the title, description, and an optional action.
 */
export interface CardHeaderProps extends React.ComponentProps<'div'> {}

/**
 * The title of the card.
 */
export interface CardTitleProps extends React.ComponentProps<'div'> {}

/**
 * The description of the card, displayed below the title.
 */
export interface CardDescriptionProps extends React.ComponentProps<'div'> {}

/**
 * An action displayed at the end of the card header, such as a button or link.
 */
export interface CardActionProps extends React.ComponentProps<'div'> {}

/**
 * The main content of the card.
 */
export interface CardContentProps extends React.ComponentProps<'div'> {}

/**
 * The footer of the card, typically containing actions.
 */
export interface CardFooterProps extends React.ComponentProps<'div'> {}
