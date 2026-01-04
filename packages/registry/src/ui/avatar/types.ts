/**
 * Missing description.
 */
export interface AvatarGroupProps extends React.ComponentProps<"div"> {
	/**
	 * The size of all avatars in the group.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * Missing description.
 */
export interface AvatarProps extends AvatarImageProps {
	/**
	 * The size of the avatar.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";

	/**
	 * Content to display when the image fails to load.
	 */
	fallback?: React.ReactNode;
}

/**
 * Missing description.
 */
export interface AvatarRootProps extends React.ComponentProps<"span"> {
	/**
	 * The size of the avatar.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * Missing description.
 */
export interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
	/**
	 * The URL of the avatar image.
	 */
	src?: string;
}

/**
 * Missing description.
 */
export interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

/**
 * Missing description.
 */
export interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}
