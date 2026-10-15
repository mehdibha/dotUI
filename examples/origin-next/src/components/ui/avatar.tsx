"use client";

import * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";

import { useImageLoadingStatus } from "@/hooks/use-image-loading-status";
import type { ImageLoadingStatus } from "@/hooks/use-image-loading-status";
import { createContext } from "@/lib/context";

const avatarVariants = tv({
  slots: {
    root: "group/avatar relative inline-flex size-8 shrink-0 bg-muted align-middle *:data-badge:absolute *:data-badge:not-with-[right]:not-with-[left]:right-0 *:data-badge:not-with-[bottom]:not-with-[top]:bottom-0 rounded-full",
    image: "aspect-square size-full rounded-[inherit] object-cover",
    fallback:
      "flex size-full items-center justify-center rounded-[inherit] text-sm select-ui group-data-[size=sm]/avatar:text-xs group-data-[size=md]/avatar-group:text-xs group-data-[size=sm]/avatar-group:text-[0.625rem] bg-muted",
    badge:
      "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-fg-on-primary bg-blend-color ring-2 ring-(--surface-bg,var(--color-bg)) select-ui with-[left]:right-auto with-[top]:bottom-auto not-with-[size]:group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden not-with-[size]:group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2 not-with-[size]:group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
    group:
      "group/avatar-group flex -space-x-2 *:data-avatar:ring-2 *:data-avatar:ring-(--surface-bg,var(--color-bg))",
    groupCount:
      "relative flex shrink-0 items-center justify-center bg-muted text-fg-muted ring-2 ring-(--surface-bg,var(--color-bg)) size-8 text-sm [&>svg]:size-4 group-data-[size=sm]/avatar-group:size-6 group-data-[size=sm]/avatar-group:text-[0.625rem] group-data-[size=sm]/avatar-group:[&>svg]:size-3 group-data-[size=lg]/avatar-group:size-10 group-data-[size=lg]/avatar-group:text-base group-data-[size=lg]/avatar-group:[&>svg]:size-5 rounded-full",
  },
  variants: {
    size: {
      sm: {
        group:
          "-space-x-1 *:data-avatar:size-6 *:data-avatar:not-last:*:data-avatar-fallback:pe-1.5",
        root: "size-6",
      },
      md: {
        group:
          "-space-x-1.5 *:data-avatar:size-8 *:data-avatar:not-last:*:data-avatar-fallback:pe-2",
        root: "size-8",
      },
      lg: {
        group:
          "*:data-avatar:size-10 *:data-avatar:not-last:*:data-avatar-fallback:pe-2.5",
        root: "size-10",
      },
    },
  },
});

const { root, image, fallback, badge, group, groupCount } = avatarVariants();

const [AvatarContext, useAvatarContext] = createContext<{
  status: ImageLoadingStatus;
  setStatus: (status: ImageLoadingStatus) => void;
}>({
  name: "Avatar",
  strict: true,
});

/* -------------------------------------------------------------------------- */

interface AvatarProps
  extends React.ComponentProps<"span">, VariantProps<typeof avatarVariants> {}

function Avatar({ className, size = "md", ...props }: AvatarProps) {
  const [status, setStatus] = React.useState<ImageLoadingStatus>("idle");
  return (
    <AvatarContext value={{ status, setStatus }}>
      <span
        data-avatar=""
        data-size={size}
        className={root({ className, size })}
        {...props}
      />
    </AvatarContext>
  );
}

/* -------------------------------------------------------------------------- */

interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
  src?: string;
}

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
    setStatus(status);
  }, [status, setStatus]);

  if (status === "loaded")
    return (
      <img
        data-avatar-image=""
        className={image({ className })}
        src={src}
        alt={alt}
        {...props}
      />
    );

  return null;
}

/* -------------------------------------------------------------------------- */

interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
  const { status } = useAvatarContext("AvatarFallback");
  if (status !== "loaded")
    return (
      <span
        data-avatar-fallback=""
        className={fallback({ className })}
        {...props}
      />
    );
  return null;
};

/* -------------------------------------------------------------------------- */

interface AvatarBadgeProps extends React.ComponentProps<"span"> {}

const AvatarBadge = ({ className, ...props }: AvatarBadgeProps) => {
  return (
    <span data-avatar-badge="" className={badge({ className })} {...props} />
  );
};

/* -------------------------------------------------------------------------- */

interface AvatarGroupProps
  extends React.ComponentProps<"div">, VariantProps<typeof avatarVariants> {}

const AvatarGroup = ({
  className,
  size = "md",
  ...props
}: AvatarGroupProps) => {
  return (
    <div
      data-avatar-group=""
      data-size={size}
      className={group({ className, size })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface AvatarGroupCountProps extends React.ComponentProps<"span"> {}

const AvatarGroupCount = ({ className, ...props }: AvatarGroupCountProps) => {
  return (
    <span
      data-avatar-group-count=""
      className={groupCount({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type {
  AvatarBadgeProps,
  AvatarFallbackProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
  AvatarImageProps,
  AvatarProps,
};
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
