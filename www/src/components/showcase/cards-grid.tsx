import { memo } from 'react'

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

// Every showcase card in one place — the single source of truth for what the
// landing grid and the /create preview masonry render.
const CARDS = {
  accountMenu: <AccountMenu />,
  appearance: <Appearance />,
  booking: <Booking />,
  colorEditor: <ColorEditorCard />,
  commandMenu: <CommandMenu />,
  computerUse: <ComputerUse />,
  cookiePreferences: <CookiePreferences />,
  displaySettings: <DisplaySettings />,
  faq: <Faq />,
  filters: <Filters />,
  inviteMembers: <InviteMembers />,
  loginForm: <LoginForm className="max-w-none" />,
  metrics: <Metrics />,
  notifications: <Notifications className="h-100" />,
  payment: <Payment />,
  pricingPlans: <PricingPlans />,
  shortcuts: <Shortcuts />,
  storage: <Storage />,
  teamName: <TeamName />,
  twoFactor: <TwoFactor />,
  uploadAvatar: <UploadAvatar />,
}

type CardKey = keyof typeof CARDS

// The landing columns are hand-balanced: each list's card heights add up to
// roughly the same total, so every column bottoms out at about the same level
// and the showcase's bottom fade swallows the small residual spread. The rail
// and the two main columns render identically at every breakpoint; the side
// column is the 4th column, present wherever the grid runs four columns
// (sm–lg, where the 80%-zoomed bleed fits an extra column, and xl+), so
// hiding it elsewhere leaves the remaining three columns balanced on their
// own.
const RAIL: CardKey[] = [
  'booking',
  'twoFactor',
  'filters',
  'accountMenu',
  'shortcuts',
]
const MAIN_LEFT: CardKey[] = [
  'colorEditor',
  'storage',
  'inviteMembers',
  'loginForm',
  'teamName',
]
const MAIN_RIGHT: CardKey[] = [
  'notifications',
  'payment',
  'faq',
  'metrics',
  'appearance',
]
const SIDE: CardKey[] = [
  'commandMenu',
  'computerUse',
  'uploadAvatar',
  'pricingPlans',
  'displaySettings',
  'cookiePreferences',
]

// A fixed flex column of cards. Fixed columns (rather than CSS `columns`) keep
// a preset swap cheap: the multi-column balancer could re-flow cards between
// columns when densities change, while fixed columns just grow each card in
// place. `content-visibility` lets the browser skip laying out the off-screen
// cards.
function CardColumn({
  cards,
  className,
}: {
  cards: CardKey[]
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}>
      {cards.map((key) => (
        <div
          key={key}
          className="[contain-intrinsic-size:auto_320px] [content-visibility:auto]"
        >
          {CARDS[key]}
        </div>
      ))}
    </div>
  )
}

// The landing showcase grid: a rail, the AI banner over two card columns, and a
// side column wherever four columns fit. Three equal columns, four at sm–lg
// and xl. Memoized: the grid re-themes via context and CSS vars, so a parent
// re-render (preset swap) never needs to re-render the cards themselves.
export const CardsGrid = memo(function CardsGrid({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 items-start gap-4 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      <CardColumn cards={RAIL} />
      <div className="col-span-2 flex min-w-0 flex-col gap-4">
        <AiPrompt />
        <div className="flex gap-4">
          <CardColumn cards={MAIN_LEFT} />
          <CardColumn cards={MAIN_RIGHT} />
        </div>
      </div>
      <CardColumn cards={SIDE} className="hidden sm:flex lg:hidden xl:flex" />
    </div>
  )
})

// The /create preview and preset thumbnails: the banner over a CSS-columns
// masonry of every card. It never animates, so the column balancer's per-frame
// re-flow cost doesn't apply here.
export function CardsMasonry({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <AiPrompt />
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {[...RAIL, ...MAIN_LEFT, ...MAIN_RIGHT, ...SIDE].map((key) => (
          // The vertical gap is the cell's *padding*, not a margin: Safari leaks
          // a child's margin-bottom across column breaks, pushing the next
          // column's first card down.
          <div key={key} className="break-inside-avoid pb-4">
            {CARDS[key]}
          </div>
        ))}
      </div>
    </div>
  )
}
