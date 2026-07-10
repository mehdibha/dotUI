import { memo } from 'react'

import { cn } from '@/registry/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '@/registry/ui/card'
import { Skeleton } from '@/registry/ui/skeleton'

/*
 * Decorative skeleton-card rails that flank the real showcase grid on md+
 * screens — the same idea as shadcn's homepage `CardsSkeletonRails`. They live
 * in the gutters beside the container-aligned real grid and are clipped by the parent's
 * `overflow-hidden`, so they peek in from both edges and reveal more as the
 * viewport widens. Purely decorative: wrapped in a single <Skeleton isLoading>
 * (which adds `inert` + shimmer) and `aria-hidden`.
 */

// A single shimmering block. `data-skeleton` is picked up by the parent
// <Skeleton isLoading> wrapper, which paints it muted and animates it.
function Bar({ className }: { className?: string }) {
  return (
    <div data-skeleton="block" className={cn('h-3 rounded-md', className)} />
  )
}

function Dot({ className }: { className?: string }) {
  return (
    <div data-skeleton="circle" className={cn('size-8 shrink-0', className)} />
  )
}

function StatCard() {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <Bar className="h-4 w-24" />
        <Bar className="w-32" />
      </CardHeader>
      <CardContent>
        <Bar className="aspect-[1/0.55] h-auto w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

function ListCard() {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <Bar className="h-4 w-28" />
        <Bar className="w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Dot />
            <div className="flex-1 space-y-2">
              <Bar className="w-2/3" />
              <Bar className="w-1/3" />
            </div>
            <Bar className="h-6 w-12 rounded-md" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function FormCard() {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <Bar className="h-4 w-32" />
        <Bar className="w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Bar className="w-16" />
          <Bar className="h-9 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Bar className="w-20" />
          <Bar className="h-9 w-full rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Bar className="h-8 w-20 rounded-lg" />
        <Bar className="h-8 w-24 rounded-lg" />
      </CardFooter>
    </Card>
  )
}

function ToggleCard() {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <Bar className="h-4 w-28" />
        <Bar className="w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Bar className="w-1/2" />
              <Bar className="w-3/4" />
            </div>
            <Bar className="h-5 w-9 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function TextCard() {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <Bar className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Bar className="w-full" />
        <Bar className="w-full" />
        <Bar className="w-4/5" />
        <Bar className="w-2/3" />
      </CardContent>
    </Card>
  )
}

// One 5-card ordering per rail column (two columns per rail).
const COL_1 = [StatCard, ListCard, TextCard, FormCard, ToggleCard]
const COL_2 = [ToggleCard, FormCard, StatCard, TextCard, ListCard]
const COL_3 = [ListCard, TextCard, ToggleCard, StatCard, FormCard]
const COL_4 = [FormCard, StatCard, ListCard, ToggleCard, TextCard]

// Each column repeats its ordering ×3 (~15 cards, ~3000px) so it overflows the
// *tallest* real grid — the 3-column layout below `xl`, ~2336px — and the rails
// reach the bottom fade on every screen instead of stopping short partway down. The
// surplus is clipped by the rail's `overflow-hidden`.
const RAIL_COLUMNS = [
  [...COL_1, ...COL_1, ...COL_1],
  [...COL_2, ...COL_2, ...COL_2],
  [...COL_3, ...COL_3, ...COL_3],
  [...COL_4, ...COL_4, ...COL_4],
] as const

function RailColumn({
  cards,
}: {
  cards: readonly (() => React.ReactElement)[]
}) {
  return (
    <div className="flex flex-col gap-(--rail-gap)">
      {cards.map((CardComponent, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  )
}

// Memoized: the rails are static decoration outside the themed scope, so a
// preset swap in the parent never needs to re-render them.
export const SkeletonRail = memo(function SkeletonRail({
  side,
}: {
  side: 'left' | 'right'
}) {
  const [colA, colB] =
    side === 'left'
      ? ([RAIL_COLUMNS[0], RAIL_COLUMNS[1]] as const)
      : ([RAIL_COLUMNS[2], RAIL_COLUMNS[3]] as const)
  return (
    <Skeleton
      isLoading
      aria-hidden="true"
      className={cn(
        'relative hidden shrink-0 basis-[calc(var(--gutter)_-_--spacing(4))] overflow-hidden opacity-70 max-lg:basis-10 md:block',
        '[--rail-col:18rem] [--rail-w:calc(var(--rail-col)*2+var(--rail-gap))]',
        side === 'left'
          ? '[mask-image:linear-gradient(to_left,black_92%,transparent)]'
          : '[mask-image:linear-gradient(to_right,black_92%,transparent)]',
      )}
    >
      <div
        className={cn(
          'absolute top-0 grid w-(--rail-w) grid-cols-2 gap-(--rail-gap) opacity-45',
          side === 'left' ? 'right-0' : 'left-0',
        )}
      >
        <RailColumn cards={colA} />
        <RailColumn cards={colB} />
      </div>
    </Skeleton>
  )
})
