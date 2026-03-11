/**
 * A group container that displays multiple avatars together with overlapping layout.
 */
export interface AvatarGroupProps extends React.ComponentProps<"div"> {
	/**
	 * The size of all avatars in the group.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * A visual representation of a user or entity, displayed as an image, initials, or placeholder.
 */
export interface AvatarProps extends React.ComponentProps<"span"> {
	/**
	 * The size of the avatar.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * The image element displayed within the avatar. Automatically hidden when the image fails to load.
 */
export interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
	/**
	 * The URL of the avatar image.
	 */
	src?: string;
}

/**
 * Content displayed when the avatar image fails to load. Typically shows initials or an icon.
 */
export interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

/**
 * A loading placeholder displayed while the avatar image is being loaded.
 */
export interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}

/**
 * A small indicator displayed on the avatar, typically used to show online status.
 */
export interface AvatarBadgeProps extends React.ComponentProps<"span"> {}

/**
 * A count indicator displayed at the end of an avatar group to show remaining items.
 */
export interface AvatarGroupCountProps extends React.ComponentProps<"span"> {}
