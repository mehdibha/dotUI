import { cn } from '@/registry/lib/utils'
import { AccountMenu } from '@/components/showcase/account-menu'
import { AskAi } from '@/components/showcase/ask-ai'
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

// The masonry grid of showcase cards — the single source of truth for which cards
// render and in what order. Shared by the landing page (`cards.tsx` wraps it with
// the skeleton rails and edge fade) and the /create preview's "Cards" view, so
// both render the exact same cards. The cells, gap, and card order stay identical
// everywhere; only the responsive column count and width vary by context, so each
// caller passes those via `className` (the landing bumps to 4-up at xl, the
// preview narrows to 1–3-up), merged by `cn` over the 3-up default below.
export function CardsGrid({ className }: { className?: string }) {
  return (
    <div className={cn('columns-3 gap-4', className)}>
      <Cell>
        <Booking />
      </Cell>
      <Cell>
        <TwoFactor />
      </Cell>
      <Cell>
        <Filters />
      </Cell>
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
        <Shortcuts />
      </Cell>
      <Cell>
        <Payment />
      </Cell>
      <Cell>
        <ComputerUse />
      </Cell>
      <Cell>
        <AccountMenu />
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
        <AskAi />
      </Cell>
      <Cell>
        <LoginForm className="max-w-none" />
      </Cell>
    </div>
  )
}
