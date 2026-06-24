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

// Placement for the featured AI-prompt card on the landing grid (3-up, 4-up at
// xl): it leads, pinned top-right, spanning 2 of 3 columns and 3 of 4 at xl.
// `self-stretch` makes it fill the height of the (taller) card beside it so the
// composer reads as a hero rather than a short box. Each caller's column count
// differs, so the narrower /create preview overrides this via `featuredClassName`.
const FEATURED_LANDING =
  'col-span-2 col-start-2 self-stretch xl:col-span-3 xl:col-start-2'

// The bento grid of showcase cards — the single source of truth for which cards
// render and in what order. Shared by the landing page (`cards.tsx` wraps it with
// the skeleton rails and edge fade) and the /create preview's "Cards" view, so
// both render the exact same cards. `grid-flow-row-dense` lets the regular cards
// backfill the cells the featured card leaves open (the left column and the rows
// below it); `items-start` keeps each card its natural height instead of
// stretching to its row. The responsive column count and width vary by context,
// so each caller passes those via `className` (the landing bumps to 4-up at xl,
// the preview narrows to 1–3-up), merged by `cn` over the 3-up default below.
export function CardsGrid({
  className,
  featuredClassName,
}: {
  className?: string
  featuredClassName?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-flow-row-dense grid-cols-3 items-start gap-4',
        className,
      )}
    >
      <div className={featuredClassName ?? FEATURED_LANDING}>
        <AiPrompt />
      </div>
      <Booking />
      <TwoFactor />
      <Filters />
      <Storage />
      <Notifications className="h-100" />
      <CookiePreferences />
      <InviteMembers />
      <Shortcuts />
      <Payment />
      <ComputerUse />
      <AccountMenu />
      <Faq />
      <ColorEditorCard />
      <UploadAvatar />
      <TeamName />
      <LoginForm className="max-w-none" />
    </div>
  )
}
