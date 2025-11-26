export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /**
   * The size of all avatars in the group.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

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

export interface AvatarRootProps extends React.ComponentProps<"span"> {
  /**
   * The size of the avatar.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

export interface AvatarImageProps
  extends Omit<React.ComponentProps<"img">, "src"> {
  /**
   * The URL of the avatar image.
   */
  src?: string;
}

export interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

export interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}
