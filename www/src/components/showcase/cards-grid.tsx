import { cn } from '@/registry/lib/utils'
import { AccountMenu } from '@/components/showcase/account-menu'
import { AiPrompt } from '@/components/showcase/ai-prompt'
import { Appearance } from '@/components/showcase/appearance'
import { Booking } from '@/components/showcase/booking'
import { ColorEditorCard } from '@/components/showcase/color-editor'
import { CommandMenu } from '@/components/showcase/command-menu'
import { ComputerUse } from '@/components/showcase/computer-use'
import { CookiePreferences } from '@/components/showcase/cookie-preferences'
import { DisplaySettings } from '@/components/showcase/display-settings'
import { Faq } from '@/components/showcase/faq'
import { Filters } from '@/components/showcase/filters'
import { InviteMembers } from '@/components/showcase/invite-members'
import { LoginForm } from '@/components/showcase/login-form'
import { Metrics } from '@/components/showcase/metrics'
import { Notifications } from '@/components/showcase/notifications'
import { Payment } from '@/components/showcase/payment'
import { PricingPlans } from '@/components/showcase/pricing-plans'
import { Shortcuts } from '@/components/showcase/shortcuts'
import { Storage } from '@/components/showcase/storage'
import { TeamName } from '@/components/showcase/team-name'
import { TwoFactor } from '@/components/showcase/two-factor'
import { UploadAvatar } from '@/components/showcase/upload-avatar'

// Column schemes for the two surfaces. Each keeps the rail at one column and
// lets the main region take the rest: the outer grid splits the row into N equal
// units, the rail takes 1, the main takes N-1.
const LAYOUTS = {
  landing: {
    outer: 'grid-cols-3 xl:grid-cols-4',
    main: 'col-span-2 xl:col-span-3',
  },
  // /create preview: narrower pane, 1 → 2 → 3 columns; never opens a 4th column.
  preview: {
    outer: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    main: 'lg:col-span-2',
  },
} as const

// One masonry cell. The vertical gap between cards is the cell's *padding*-bottom,
// never a margin: in a CSS multi-column layout WebKit/Safari leaks a child's
// `margin-bottom` onto the top of the *next* column, so a `*:mb-4` on the grid
// pushes whichever card lands at the top of a balanced column down by 16px — only
// in Safari (Chromium aligns them). Padding stays inside the cell's box at the
// column break, so every column's first card starts flush at the top everywhere.
// `break-inside-avoid` keeps each card whole instead of splitting across columns.
function Cell({ children }: { children: React.ReactNode }) {
  return <div className="break-inside-avoid pb-4">{children}</div>
}

// A masonry laid out as `count` FIXED flex columns instead of CSS `columns`. This is
// what makes the landing preset morph smooth: with real `columns`, changing card
// heights forces the multi-column balancer to re-flow cards *between* columns every
// frame (expensive, and cards visibly jump). Fixed columns just grow each card in
// place — and, being plain block flow, they let `content-visibility:auto` actually
// skip the off-screen cards, so only the few on-screen ones re-lay-out per frame.
// Cards are distributed round-robin (the ragged bottom is masked away anyway). The
// /create preview keeps CSS `columns` — it never animates, so it pays none of this.
function FixedColumns({
  items,
  count,
  className,
  columnClassName,
}: {
  items: { key: string; node: React.ReactNode }[]
  count: number
  className?: string
  columnClassName?: string
}) {
  const columns: { key: string; node: React.ReactNode }[][] = Array.from(
    { length: count },
    () => [],
  )
  items.forEach((item, i) => columns[i % count]!.push(item))
  return (
    <div className={cn('flex gap-4', className)}>
      {columns.map((column, ci) => (
        <div
          key={ci}
          className={cn('flex min-w-0 flex-1 flex-col gap-4', columnClassName)}
        >
          {column.map((item) => (
            <div
              key={item.key}
              className="[contain-intrinsic-size:auto_320px] [content-visibility:auto]"
            >
              {item.node}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// The showcase grid — the single source of truth for which cards render. Shared by
// the landing page (`cards.tsx` wraps it with the skeleton rails and edge fade) and
// the /create preview's "Cards" view, so both render the exact same cards.
//
// Layout: a left RAIL flows on its own; the MAIN region holds the AI banner and the
// rest of the cards. The banner has to stay narrow (two columns) *and* keep its own
// short height — nothing beside it should stretch it — but CSS multi-column can't
// span a banner across part of a masonry. So on the landing surface the main region
// is two independent flows: the banner sits over its own 2-column masonry (cards
// pack straight up under it, no gap), and a separate side column takes the rest. On
// xl that side column is the grid's 4th column; below xl it drops beneath as its own
// masonry. The narrower /create preview never opens a 4th column, so there the
// banner just sits full-width over a single masonry.
export function CardsGrid({
  className,
  variant = 'landing',
}: {
  className?: string
  variant?: keyof typeof LAYOUTS
}) {
  const layout = LAYOUTS[variant]

  // Every card that isn't in the rail or the AI banner, in source order.
  const cards = [
    { key: 'storage', node: <Storage /> },
    { key: 'notifications', node: <Notifications className="h-100" /> },
    { key: 'cookie', node: <CookiePreferences /> },
    { key: 'invite', node: <InviteMembers /> },
    { key: 'payment', node: <Payment /> },
    { key: 'computer', node: <ComputerUse /> },
    { key: 'faq', node: <Faq /> },
    { key: 'color', node: <ColorEditorCard /> },
    { key: 'upload', node: <UploadAvatar /> },
    { key: 'team', node: <TeamName /> },
    { key: 'login', node: <LoginForm className="max-w-none" /> },
  ]
  const cells = (subset: typeof cards) =>
    subset.map((c) => <Cell key={c.key}>{c.node}</Cell>)
  // On landing these cards live in the side column, beside (not under) the banner.
  const sideKeys = new Set(['team', 'cookie', 'computer', 'upload'])

  const masonryCards = cards.filter((c) => !sideKeys.has(c.key))
  const sideCards = cards.filter((c) => sideKeys.has(c.key))

  // xl-only fillers for the landing variant. At xl the masonry and side columns sit
  // beside the AI banner with no banner above them, so they bottom out short; these
  // top them up. Below xl the side folds under the masonry and the rail's extra cards
  // do the balancing instead, so these are hidden.
  const masonryFillers =
    variant === 'landing'
      ? [
          {
            key: 'metrics-xl',
            node: (
              <div className="hidden xl:block">
                <Metrics />
              </div>
            ),
          },
          {
            key: 'command-xl',
            node: (
              <div className="hidden xl:block">
                <CommandMenu />
              </div>
            ),
          },
        ]
      : []
  const sideFillers =
    variant === 'landing'
      ? [
          {
            key: 'pricing-xl',
            node: (
              <div className="hidden xl:block">
                <PricingPlans />
              </div>
            ),
          },
          {
            key: 'appearance-xl',
            node: (
              <div className="hidden xl:block">
                <Appearance />
              </div>
            ),
          },
        ]
      : []

  return (
    <div className={cn('grid items-start gap-4', layout.outer, className)}>
      {/* Left rail: its own single-column stack. */}
      <div className="flex flex-col gap-4">
        <Booking />
        <TwoFactor />
        <Filters />
        <Shortcuts />
        <AccountMenu />
        {/* Below xl the side group folds under the masonry (see the side column),
            which leaves this rail the shortest column. These extra cards refill it
            so every column bottoms out at roughly the same level. They're dropped at
            xl, where the rail is already full and the side becomes its own column. */}
        {variant === 'landing' && (
          <>
            <CommandMenu className="xl:hidden" />
            <DisplaySettings className="xl:hidden" />
          </>
        )}
      </div>

      {variant === 'landing' ? (
        // Two independent flows: the banner over its own masonry, plus a side
        // column. Splitting at xl into a 2-col + 1-col grid (`items-start` so the
        // columns don't stretch to match each other) keeps the banner short and
        // lets the cards beneath flow straight up under it.
        <div
          className={cn(
            'flex flex-col gap-4 xl:grid xl:grid-cols-3 xl:items-start',
            layout.main,
          )}
        >
          <div className="flex flex-col gap-4 xl:col-span-2">
            <AiPrompt />
            <FixedColumns
              items={[...masonryCards, ...masonryFillers]}
              count={2}
            />
          </div>
          {/* Side: two columns below xl; at xl the outer stacks (`flex-col`) and the
				      inner columns un-flex (`flex-none`), so all four cards form the single 4th
				      column. */}
          <FixedColumns
            items={[...sideCards, ...sideFillers]}
            count={2}
            className="xl:flex-col"
            columnClassName="xl:flex-none"
          />
        </div>
      ) : (
        // Preview: the banner full-width over a single masonry of every card.
        <div className={cn('flex flex-col gap-4', layout.main)}>
          <AiPrompt />
          <div className="columns-1 gap-4 lg:columns-2">{cells(cards)}</div>
        </div>
      )}
    </div>
  )
}
