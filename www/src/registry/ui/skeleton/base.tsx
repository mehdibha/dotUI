'use client'

import * as React from 'react'

import { cn } from '@/registry/lib/utils'

import { useStyles } from './styles'

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
  const { root } = useStyles()()
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
