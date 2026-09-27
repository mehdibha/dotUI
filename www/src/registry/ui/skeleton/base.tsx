"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import { useStyles } from "./styles"

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  isLoading?: boolean
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const isSkeletonLoop = (animation: Animation) =>
  animation instanceof CSSAnimation &&
  animation.animationName.startsWith("skeleton-")

/* CSS runs the loop; this pins every placeholder's to one phase, so ones
   that mount later don't pulse out of step. */
function useSyncedSkeletonAnimation(
  ref: React.RefObject<HTMLElement | null>,
  isLoading: boolean,
  className: string | undefined,
) {
  useIsomorphicLayoutEffect(() => {
    const root = ref.current
    if (!root || !isLoading || typeof root.getAnimations !== "function") return

    const sync = () => {
      for (const animation of root.getAnimations({ subtree: true })) {
        if (isSkeletonLoop(animation)) animation.startTime = 0
      }
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [className, isLoading, ref])
}

export function Skeleton({
  className,
  children,
  isLoading,
  ...props
}: SkeletonProps) {
  const { root } = useStyles()()
  const ref = React.useRef<HTMLDivElement>(null)
  const hasChildren = children != null
  const shouldShowSkeleton = isLoading ?? !hasChildren
  const rootClassName = shouldShowSkeleton
    ? root({
        className: cn(
          !hasChildren &&
            "skeleton block h-6 rounded-(--studio-skeleton-block-radius)",
          className,
        ),
      })
    : className

  useSyncedSkeletonAnimation(ref, shouldShowSkeleton, rootClassName)

  if (!hasChildren && !shouldShowSkeleton) return null

  return (
    <div
      ref={ref}
      data-skeleton-loading={shouldShowSkeleton ? "" : undefined}
      aria-busy={shouldShowSkeleton ? "true" : undefined}
      inert={shouldShowSkeleton ? true : undefined}
      className={rootClassName}
      {...props}
    >
      {children}
    </div>
  )
}
