"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { tv } from "tailwind-variants";

const skeletonVariants = tv({
  slots: {
    root: "group/skeleton pointer-events-none select-none **:data-[skeleton=text]:rounded-xs **:data-[skeleton=text]:text-transparent **:data-[skeleton=block]:skeleton **:data-[skeleton=text]:skeleton **:data-[skeleton=circle]:skeleton **:data-[skeleton=circle]:rounded-full **:data-[skeleton=control]:skeleton **:data-[skeleton=control]:border-transparent **:data-[skeleton=control]:text-transparent **:data-[skeleton=media]:skeleton **:data-text:skeleton **:data-text:rounded-xs **:data-text:text-transparent **:data-label:skeleton **:data-label:rounded-xs **:data-label:text-transparent **:data-description:skeleton **:data-description:rounded-xs **:data-description:text-transparent **:data-card-title:skeleton **:data-card-title:rounded-xs **:data-card-title:text-transparent **:data-card-description:skeleton **:data-card-description:rounded-xs **:data-card-description:text-transparent **:data-menu-item-label:skeleton **:data-menu-item-label:rounded-xs **:data-menu-item-label:text-transparent **:data-menu-item-description:skeleton **:data-menu-item-description:rounded-xs **:data-menu-item-description:text-transparent **:data-listbox-item-label:skeleton **:data-listbox-item-label:rounded-xs **:data-listbox-item-label:text-transparent **:data-listbox-item-description:skeleton **:data-listbox-item-description:rounded-xs **:data-listbox-item-description:text-transparent [&_h1]:skeleton [&_h1]:rounded-xs [&_h1]:text-transparent [&_h2]:skeleton [&_h2]:rounded-xs [&_h2]:text-transparent [&_h3]:skeleton [&_h3]:rounded-xs [&_h3]:text-transparent [&_h4]:skeleton [&_h4]:rounded-xs [&_h4]:text-transparent [&_h5]:skeleton [&_h5]:rounded-xs [&_h5]:text-transparent [&_h6]:skeleton [&_h6]:rounded-xs [&_h6]:text-transparent [&_p]:skeleton [&_p]:rounded-xs [&_p]:text-transparent [&_small]:skeleton [&_small]:rounded-xs [&_small]:text-transparent [&_strong]:skeleton [&_strong]:rounded-xs [&_strong]:text-transparent [&_em]:skeleton [&_em]:rounded-xs [&_em]:text-transparent [&_code]:skeleton [&_code]:rounded-xs [&_code]:text-transparent [&_kbd]:not-data-kbd:skeleton [&_kbd]:not-data-kbd:rounded-xs [&_kbd]:not-data-kbd:text-transparent [&_samp]:skeleton [&_samp]:rounded-xs [&_samp]:text-transparent [&_figcaption]:skeleton [&_figcaption]:rounded-xs [&_figcaption]:text-transparent [&_legend]:skeleton [&_legend]:rounded-xs [&_legend]:text-transparent **:data-button:skeleton **:data-button:border-transparent **:data-button:text-transparent **:data-button:shadow-none **:data-input-control:skeleton **:data-input-control:border-transparent **:data-input-control:text-transparent **:data-input-control:placeholder:text-transparent **:data-badge:skeleton **:data-badge:border-transparent **:data-badge:text-transparent **:data-tag:skeleton **:data-tag:border-transparent **:data-tag:text-transparent **:data-kbd:skeleton **:data-kbd:border-transparent **:data-kbd:text-transparent **:data-combobox-value:skeleton **:data-combobox-value:rounded-xs **:data-combobox-value:text-transparent **:data-avatar:skeleton **:data-avatar:text-transparent **:data-avatar-group-count:skeleton **:data-avatar-group-count:text-transparent [&_[data-avatar-group-count]_*]:invisible [&_[data-avatar]_*]:invisible [&_[data-badge]_*]:invisible [&_[data-button]_*]:invisible [&_[data-kbd]_*]:invisible [&_[data-tag]_*]:invisible [&_[data-skeleton=circle]_*]:invisible [&_[data-skeleton=control]_*]:invisible [&_[data-skeleton=media]_*]:invisible skeleton--shimmer",
  },
});

const { root } = skeletonVariants();

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  isLoading?: boolean;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const isSkeletonLoop = (animation: Animation) =>
  animation instanceof CSSAnimation &&
  animation.animationName.startsWith("skeleton-");

/* CSS runs the loop; this pins every placeholder's to one phase, so ones
   that mount later don't pulse out of step. */
function useSyncedSkeletonAnimation(
  ref: React.RefObject<HTMLElement | null>,
  isLoading: boolean,
  className: string | undefined,
) {
  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || !isLoading || typeof root.getAnimations !== "function") return;

    const sync = () => {
      for (const animation of root.getAnimations({ subtree: true })) {
        if (isSkeletonLoop(animation)) animation.startTime = 0;
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [className, isLoading, ref]);
}

export function Skeleton({
  className,
  children,
  isLoading,
  ...props
}: SkeletonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const hasChildren = children != null;
  const shouldShowSkeleton = isLoading ?? !hasChildren;
  const rootClassName = shouldShowSkeleton
    ? root({
        className: cn(
          !hasChildren && "skeleton block h-6 rounded-sm",
          className,
        ),
      })
    : className;

  useSyncedSkeletonAnimation(ref, shouldShowSkeleton, rootClassName);

  if (!hasChildren && !shouldShowSkeleton) return null;

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
  );
}
