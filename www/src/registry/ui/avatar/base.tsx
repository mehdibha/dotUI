"use client"

import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { useImageLoadingStatus } from "@/registry/hooks/use-image-loading-status"
import type { ImageLoadingStatus } from "@/registry/hooks/use-image-loading-status"
import { createContext } from "@/registry/lib/context"

import { useStyles } from "./styles"
import type { AvatarStyles } from "./styles"

// MARK: avatarStyles

const [AvatarContext, useAvatarContext] = createContext<{
  status: ImageLoadingStatus
  setStatus: (status: ImageLoadingStatus) => void
}>({
  name: "Avatar",
  strict: true,
})

/** A stable 0–3 index from the fallback text, so tinted fallbacks differ per entity. */
function tintOf(children: React.ReactNode): number {
  const text =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : ""
  let hash = 0
  for (let i = 0; i < text.length; i++)
    hash = (hash * 31 + text.charCodeAt(i)) | 0
  return Math.abs(hash) % 4
}

// MARK: Separator

interface AvatarProps
  extends React.ComponentProps<"span">, VariantProps<AvatarStyles> {}

function Avatar({ className, size = "md", ...props }: AvatarProps) {
  const [status, setStatus] = React.useState<ImageLoadingStatus>("idle")
  const { root } = useStyles()()

  return (
    <AvatarContext value={{ status, setStatus }}>
      <span
        data-avatar=""
        data-size={size}
        className={root({ className, size })}
        {...props}
      />
    </AvatarContext>
  )
}

// MARK: Separator

interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
  src?: string
}

function AvatarImage({
  src,
  alt,
  className,
  referrerPolicy,
  crossOrigin,
  ...props
}: AvatarImageProps) {
  const status = useImageLoadingStatus(src, { referrerPolicy, crossOrigin })
  const { setStatus } = useAvatarContext("AvatarImage")
  const { image } = useStyles()()

  React.useLayoutEffect(() => {
    setStatus(status)
  }, [status, setStatus])

  if (status === "loaded")
    return (
      <img
        data-avatar-image=""
        className={image({ className })}
        src={src}
        alt={alt}
        {...props}
      />
    )

  return null
}

// MARK: Separator

interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

const AvatarFallback = ({
  className,
  children,
  ...props
}: AvatarFallbackProps) => {
  const { status } = useAvatarContext("AvatarFallback")
  const { fallback } = useStyles()()
  if (status !== "loaded")
    return (
      <span
        data-avatar-fallback=""
        data-tint={tintOf(children)}
        className={fallback({ className })}
        {...props}
      >
        {children}
      </span>
    )
  return null
}

// MARK: Separator

interface AvatarBadgeProps extends React.ComponentProps<"span"> {}

const AvatarBadge = ({ className, ...props }: AvatarBadgeProps) => {
  const { badge } = useStyles()()
  return (
    <span data-avatar-badge="" className={badge({ className })} {...props} />
  )
}

// MARK: Separator

interface AvatarGroupProps
  extends React.ComponentProps<"div">, VariantProps<AvatarStyles> {}

const AvatarGroup = ({
  className,
  size = "md",
  ...props
}: AvatarGroupProps) => {
  const { group } = useStyles()()
  return (
    <div
      data-avatar-group=""
      data-size={size}
      className={group({ className, size })}
      {...props}
    />
  )
}

// MARK: Separator

interface AvatarGroupCountProps extends React.ComponentProps<"span"> {}

const AvatarGroupCount = ({ className, ...props }: AvatarGroupCountProps) => {
  const { groupCount } = useStyles()()
  return (
    <span
      data-avatar-group-count=""
      className={groupCount({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type {
  AvatarBadgeProps,
  AvatarFallbackProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
  AvatarImageProps,
  AvatarProps,
}
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
