'use client'

import * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'
const skeletonVariants = tv({
  slots: {
    root: [
      'group/skeleton pointer-events-none select-none',
      '**:data-[skeleton=text]:rounded-sm **:data-[skeleton=text]:text-transparent',
      '**:data-[skeleton=block]:skeleton **:data-[skeleton=text]:skeleton',
      '**:data-[skeleton=circle]:skeleton **:data-[skeleton=circle]:rounded-full',
      '**:data-[skeleton=control]:skeleton **:data-[skeleton=control]:border-transparent **:data-[skeleton=control]:text-transparent',
      '**:data-[skeleton=media]:skeleton',
      '**:data-text:skeleton **:data-text:rounded-sm **:data-text:text-transparent',
      '**:data-label:skeleton **:data-label:rounded-sm **:data-label:text-transparent',
      '**:data-description:skeleton **:data-description:rounded-sm **:data-description:text-transparent',
      '**:data-card-title:skeleton **:data-card-title:rounded-sm **:data-card-title:text-transparent',
      '**:data-card-description:skeleton **:data-card-description:rounded-sm **:data-card-description:text-transparent',
      '**:data-menu-item-label:skeleton **:data-menu-item-label:rounded-sm **:data-menu-item-label:text-transparent',
      '**:data-menu-item-description:skeleton **:data-menu-item-description:rounded-sm **:data-menu-item-description:text-transparent',
      '**:data-listbox-item-label:skeleton **:data-listbox-item-label:rounded-sm **:data-listbox-item-label:text-transparent',
      '**:data-listbox-item-description:skeleton **:data-listbox-item-description:rounded-sm **:data-listbox-item-description:text-transparent',
      '[&_h1]:skeleton [&_h1]:rounded-sm [&_h1]:text-transparent',
      '[&_h2]:skeleton [&_h2]:rounded-sm [&_h2]:text-transparent',
      '[&_h3]:skeleton [&_h3]:rounded-sm [&_h3]:text-transparent',
      '[&_h4]:skeleton [&_h4]:rounded-sm [&_h4]:text-transparent',
      '[&_h5]:skeleton [&_h5]:rounded-sm [&_h5]:text-transparent',
      '[&_h6]:skeleton [&_h6]:rounded-sm [&_h6]:text-transparent',
      '[&_p]:skeleton [&_p]:rounded-sm [&_p]:text-transparent',
      '[&_small]:skeleton [&_small]:rounded-sm [&_small]:text-transparent',
      '[&_strong]:skeleton [&_strong]:rounded-sm [&_strong]:text-transparent',
      '[&_em]:skeleton [&_em]:rounded-sm [&_em]:text-transparent',
      '[&_code]:skeleton [&_code]:rounded-sm [&_code]:text-transparent',
      '[&_kbd]:skeleton [&_kbd]:rounded-sm [&_kbd]:text-transparent',
      '[&_samp]:skeleton [&_samp]:rounded-sm [&_samp]:text-transparent',
      '[&_figcaption]:skeleton [&_figcaption]:rounded-sm [&_figcaption]:text-transparent',
      '[&_legend]:skeleton [&_legend]:rounded-sm [&_legend]:text-transparent',
      '**:data-button:skeleton **:data-button:border-transparent **:data-button:text-transparent **:data-button:shadow-none',
      '**:data-input-control:skeleton **:data-input-control:border-transparent **:data-input-control:text-transparent **:data-input-control:placeholder:text-transparent',
      '**:data-badge:skeleton **:data-badge:border-transparent **:data-badge:text-transparent',
      '**:data-tag:skeleton **:data-tag:border-transparent **:data-tag:text-transparent',
      '**:data-kbd:skeleton **:data-kbd:border-transparent **:data-kbd:text-transparent',
      '**:data-combobox-value:skeleton **:data-combobox-value:rounded-sm **:data-combobox-value:text-transparent',
      '**:data-avatar:skeleton **:data-avatar:text-transparent',
      '**:data-avatar-group-count:skeleton **:data-avatar-group-count:text-transparent',
      '[&_[data-avatar-group-count]_*]:invisible [&_[data-avatar]_*]:invisible',
      '[&_[data-badge]_*]:invisible [&_[data-button]_*]:invisible [&_[data-kbd]_*]:invisible [&_[data-tag]_*]:invisible',
      '[&_[data-skeleton=circle]_*]:invisible [&_[data-skeleton=control]_*]:invisible [&_[data-skeleton=media]_*]:invisible',
      'skeleton--shimmer',
    ],
  },
})

type SkeletonAnimation = 'shimmer' | 'pulse' | 'none'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  isLoading?: boolean
}

const skeletonSelector = [
  '.skeleton',
  '[data-skeleton]',
  '[data-text]',
  '[data-label]',
  '[data-description]',
  '[data-card-title]',
  '[data-card-description]',
  '[data-menu-item-label]',
  '[data-menu-item-description]',
  '[data-listbox-item-label]',
  '[data-listbox-item-description]',
  '[data-button]',
  '[data-input-control]',
  '[data-badge]',
  '[data-tag]',
  '[data-kbd]',
  '[data-combobox-value]',
  '[data-avatar]',
  '[data-avatar-group-count]',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'small',
  'strong',
  'em',
  'code',
  'kbd',
  'samp',
  'figcaption',
  'legend',
].join(',')

const shimmerKeyframes: Keyframe[] = [
  { backgroundPosition: '100%' },
  { backgroundPosition: '0%' },
]
const pulseKeyframes: Keyframe[] = [
  { opacity: 1 },
  { opacity: 0.5 },
  { opacity: 1 },
]

const animationOptions: KeyframeAnimationOptions = {
  duration: 2000,
  iterations: Infinity,
  easing: 'ease-in-out',
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

function getAnimation(className: string): SkeletonAnimation {
  if (className.includes('skeleton--pulse')) return 'pulse'
  if (className.includes('skeleton--none')) return 'none'
  return 'shimmer'
}

function getSkeletonElements(root: HTMLElement): HTMLElement[] {
  const elements = root.matches(skeletonSelector) ? [root] : []
  elements.push(...root.querySelectorAll<HTMLElement>(skeletonSelector))
  return elements
}

function useSyncedSkeletonAnimation(
  ref: React.RefObject<HTMLElement | null>,
  isLoading: boolean,
  animation: SkeletonAnimation,
) {
  useIsomorphicLayoutEffect(() => {
    const root = ref.current

    if (
      !root ||
      !isLoading ||
      animation === 'none' ||
      typeof root.animate !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const keyframes = animation === 'pulse' ? pulseKeyframes : shimmerKeyframes
    const animations = new Map<HTMLElement, Animation>()

    const startAnimation = (element: HTMLElement) => {
      if (animations.has(element)) return
      const animation = element.animate(keyframes, animationOptions)
      animation.startTime = 0
      animations.set(element, animation)
    }

    const startAnimations = (element: HTMLElement) => {
      for (const skeletonElement of getSkeletonElements(element)) {
        startAnimation(skeletonElement)
      }
    }

    const stopAnimations = (element: HTMLElement) => {
      const animation = animations.get(element)
      if (animation) {
        animation.cancel()
        animations.delete(element)
      }

      for (const skeletonElement of element.querySelectorAll<HTMLElement>(
        skeletonSelector,
      )) {
        const childAnimation = animations.get(skeletonElement)
        if (childAnimation) {
          childAnimation.cancel()
          animations.delete(skeletonElement)
        }
      }
    }

    startAnimations(root)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) startAnimations(node)
        }
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLElement) stopAnimations(node)
        }
      }
    })

    observer.observe(root, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      for (const animation of animations.values()) animation.cancel()
    }
  }, [animation, isLoading, ref])
}

export function Skeleton({
  className,
  children,
  isLoading,
  ...props
}: SkeletonProps) {
  const { root } = skeletonVariants()
  const ref = React.useRef<HTMLDivElement>(null)
  const hasChildren = children != null
  const shouldShowSkeleton = isLoading ?? !hasChildren
  const rootClassName = shouldShowSkeleton
    ? root({
        className: cn(
          !hasChildren && 'skeleton block h-6 rounded-md',
          className,
        ),
      })
    : className
  const animation = getAnimation(rootClassName ?? '')

  useSyncedSkeletonAnimation(ref, shouldShowSkeleton, animation)

  if (!hasChildren && !shouldShowSkeleton) return null

  return (
    <div
      ref={ref}
      data-skeleton-loading={shouldShowSkeleton ? '' : undefined}
      aria-busy={shouldShowSkeleton ? 'true' : undefined}
      inert={shouldShowSkeleton ? true : undefined}
      className={rootClassName}
      {...props}
    >
      {children}
    </div>
  )
}
