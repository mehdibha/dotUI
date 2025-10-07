"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useImageLoadingStatus } from "@dotui/registry-v2/hooks/use-image-loading-status";
import { createScopedContext } from "@dotui/registry-v2/lib/utils";
import type { ImageLoadingStatus } from "@dotui/registry-v2/hooks/use-image-loading-status";

const avatarStyles = tv({
  slots: {
    root: "relative inline-flex shrink-0 overflow-hidden bg-bg align-middle",
    image: "aspect-square size-full",
    fallback: "flex size-full items-center justify-center bg-muted select-none",
    placeholder:
      "flex size-full h-full animate-pulse items-center justify-center bg-muted",
  },
  variants: {
    size: {
      sm: { root: "size-8" },
      md: { root: "size-10" },
      lg: { root: "size-12" },
    },
    shape: {
      circle: { root: "rounded-full" },
      square: { root: "rounded-sm" },
    },
  },
  defaultVariants: {
    shape: "circle",
    size: "md",
  },
});

const { root, image, fallback, placeholder } = avatarStyles();

const [AvatarProvider, useAvatarContext] = createScopedContext<
  VariantProps<typeof avatarStyles> & {
    status: ImageLoadingStatus;
    setStatus: (status: ImageLoadingStatus) => void;
  }
>("AvatarBase");

interface AvatarProps
  extends AvatarImageProps,
    VariantProps<typeof avatarStyles> {
  fallback?: React.ReactNode;
}
const AvatarBase = ({
  className,
  style,
  fallback,
  size,
  shape,
  ...props
}: AvatarProps) => {
  return (
    <AvatarRoot className={className} style={style} size={size} shape={shape}>
      <AvatarImage {...props} />
      <AvatarFallback>{fallback}</AvatarFallback>
      <AvatarPlaceholder />
    </AvatarRoot>
  );
};

interface AvatarRootProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof avatarStyles> {}
function AvatarRoot({ className, shape, size, ...props }: AvatarRootProps) {
  const [status, setStatus] = React.useState<ImageLoadingStatus>("idle");

  return (
    <AvatarProvider
      shape={shape}
      size={size}
      status={status}
      setStatus={setStatus}
    >
      <span
        slot="avatar"
        className={root({ className, shape, size })}
        {...props}
      />
    </AvatarProvider>
  );
}

interface AvatarImageProps extends React.ComponentProps<"img"> {}
function AvatarImage({
  src,
  alt,
  className,
  referrerPolicy,
  crossOrigin,
  ...props
}: AvatarImageProps) {
  const status = useImageLoadingStatus(src, { referrerPolicy, crossOrigin });
  const { setStatus } = useAvatarContext("AvatarImage");

  React.useLayoutEffect(() => {
    if (status !== "idle") {
      setStatus(status);
    }
  }, [status, setStatus]);

  if (status === "loaded")
    return (
      <img
        slot="avatar-image"
        className={image({ className })}
        src={src}
        alt={alt}
        {...props}
      />
    );

  return null;
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;
const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
  const { status } = useAvatarContext("AvatarFallback");
  if (status === "error")
    return (
      <span
        slot="avatar-fallback"
        className={fallback({ className })}
        {...props}
      />
    );
  return null;
};

interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}

const AvatarPlaceholder = ({ className, ...props }: AvatarPlaceholderProps) => {
  const { status } = useAvatarContext("AvatarPlaceholder");
  if (["idle", "loading"].includes(status))
    return <span className={placeholder({ className })} {...props} />;
  return null;
};

const Avatar = Object.assign(AvatarBase, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Placeholder: AvatarPlaceholder,
});

export type {
  AvatarProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarPlaceholderProps,
};
export { Avatar, AvatarRoot, AvatarImage, AvatarFallback, AvatarPlaceholder };
