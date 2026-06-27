import { cn } from '@/registry/lib/utils'
import { AccountMenu } from '@/components/showcase/account-menu'
import { AiPrompt } from '@/components/showcase/ai-prompt'
import { Booking } from '@/components/showcase/booking'
import { ColorEditorCard } from '@/components/showcase/color-editor'
import { ComputerUse } from '@/components/showcase/computer-use'
import { CookiePreferences } from '@/components/showcase/cookie-preferences'
import { Faq } from '@/components/showcase/faq'
import { Filters } from '@/components/showcase/filters'
import { InviteMembers } from '@/components/showcase/invite-members'
import { LoginForm } from '@/components/showcase/login-form'
import { Notifications } from '@/components/showcase/notifications'
import { Payment } from '@/components/showcase/payment'
import { Shortcuts } from '@/components/showcase/shortcuts'
import { Storage } from '@/components/showcase/storage'
import { TeamName } from '@/components/showcase/team-name'
import { TwoFactor } from '@/components/showcase/two-factor'
import { UploadAvatar } from '@/components/showcase/upload-avatar'

// Two column schemes for the two surfaces. Each keeps the rail at one column and
// lets the main region (AI banner + masonry) take the rest, so the rail, and the
// masonry's columns, all end up the same width: the outer grid splits the row
// into N equal units, the rail takes 1, the main takes N-1, and `columns` re-cuts
// those N-1 units back into N-1 equal columns at the same gap.
const LAYOUTS = {
  // Landing: rail + 2-column main at every size, so the AI banner caps at two
  // columns of space instead of widening into a third on large screens.
  landing: {
    outer: 'grid-cols-3',
    main: 'col-span-2',
    masonry: 'columns-2',
  },
  // /create preview: narrower pane, 1 → 2 → 3 columns.
  preview: {
    outer: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    main: 'lg:col-span-2',
    masonry: 'columns-1 lg:columns-2',
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

// The showcase grid — the single source of truth for which cards render and in
// what order. Shared by the landing page (`cards.tsx` wraps it with the skeleton
// rails and edge fade) and the /create preview's "Cards" view, so both render the
// exact same cards.
//
// Layout: the AI-prompt card has to span the top-right, which CSS multi-column
// (the masonry) can't do — a column-span there is all-or-nothing. So the grid is
// split into two regions instead: a left RAIL that flows on its own, and a MAIN
// region where the short AI banner sits on top and the remaining cards masonry-
// flow beneath it. The two flows are independent, so the cards still pack tightly
// (no aligned-row gaps) while the AI card keeps its corner. The column count and
// width vary by surface (see LAYOUTS); the landing also passes width/positioning
// via `className`.
export function CardsGrid({
  className,
  variant = 'landing',
}: {
  className?: string
  variant?: keyof typeof LAYOUTS
}) {
  const layout = LAYOUTS[variant]
  return (
    <div className={cn('grid items-start gap-4', layout.outer, className)}>
      {/* Left rail: its own single-column stack. */}
      <div className="flex flex-col gap-4">
        <Booking />
        <TwoFactor />
        <Filters />
        <Shortcuts />
        <AccountMenu />
      </div>

      {/* Main region: the AI banner pinned on top, the rest masonry-flowing below. */}
      <div className={cn('flex flex-col gap-4', layout.main)}>
        <AiPrompt />
        <div className={cn('gap-4', layout.masonry)}>
          <Cell>
            <Storage />
          </Cell>
          <Cell>
            <Notifications className="h-100" />
          </Cell>
          <Cell>
            <CookiePreferences />
          </Cell>
          <Cell>
            <InviteMembers />
          </Cell>
          <Cell>
            <Payment />
          </Cell>
          <Cell>
            <ComputerUse />
          </Cell>
          <Cell>
            <Faq />
          </Cell>
          <Cell>
            <ColorEditorCard />
          </Cell>
          <Cell>
            <UploadAvatar />
          </Cell>
          <Cell>
            <TeamName />
          </Cell>
          <Cell>
            <LoginForm className="max-w-none" />
          </Cell>
        </div>
      </div>
    </div>
  )
}
