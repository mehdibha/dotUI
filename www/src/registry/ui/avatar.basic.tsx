"use client";

import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { createScopedContext } from "@/registry/lib/utils";
import { tv } from "tailwind-variants";

const avatarStyles = tv({
  slots: {
    root: "bg-bg relative inline-flex shrink-0 overflow-hidden align-middle",
    image: "aspect-square size-full",
    fallback:
      "bg-bg-muted flex size-full items-center justify-center select-none",
    placeholder:
      "bg-bg-muted flex size-full h-full animate-pulse items-center justify-center",
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
    status: Status;
    setStatus: (status: Status) => void;
  }
>("AlertRoot");

interface AvatarProps
  extends AvatarImageProps,
    VariantProps<typeof avatarStyles> {
  fallback?: React.ReactNode;
}
const Avatar = ({
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
  const [status, setStatus] = React.useState<Status>("idle");

  return (
    <AvatarProvider
      shape={shape}
      size={size}
      status={status}
      setStatus={setStatus}
    >
      <span className={root({ className, shape, size })} {...props} />
    </AvatarProvider>
  );
}

interface AvatarImageProps extends React.ComponentProps<"img"> {}
function AvatarImage({ src, alt, className, ...props }: AvatarImageProps) {
  const status = useImageLoadingStatus(src);
  const { setStatus } = useAvatarContext("AvatarImage");

  React.useLayoutEffect(() => {
    if (status !== "idle") {
      setStatus(status);
    }
  }, [status, setStatus]);

  if (status === "success")
    return (
      <img className={image({ className })} src={src} alt={alt} {...props} />
    );

  return null;
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
  const { status } = useAvatarContext("AvatarFallback");

  if (status === "error")
    return <span className={fallback({ className })} {...props} />;

  return null;
};

interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}

const AvatarPlaceholder = ({ className, ...props }: AvatarPlaceholderProps) => {
  const { status } = useAvatarContext("AvatarPlaceholder");

  if (["idle", "loading"].includes(status))
    return <span className={placeholder({ className })} {...props} />;

  return null;
};

type Status = "idle" | "loading" | "success" | "error";
function useImageLoadingStatus(src?: string | Blob) {
  const [status, setStatus] = React.useState<Status>("idle");

  React.useLayoutEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    const image = new window.Image();
    const updateStatus = (status: Status) => () => {
      if (!isMounted) return;
      setStatus(status);
    };

    setStatus("loading");
    image.onload = updateStatus("success");
    image.onerror = updateStatus("error");

    if (src instanceof Blob) {
      objectUrl = URL.createObjectURL(src);
      image.src = objectUrl;
    } else {
      image.src = src;
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return status;
}

export type {
  AvatarProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarPlaceholderProps,
};
export { Avatar, AvatarRoot, AvatarImage, AvatarFallback, AvatarPlaceholder };
