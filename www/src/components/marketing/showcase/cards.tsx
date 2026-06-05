import { AccountMenu } from "@/components/marketing/showcase/account-menu";
import { Agents } from "@/components/marketing/showcase/agents";
import { AskAi } from "@/components/marketing/showcase/ask-ai";
import { Booking } from "@/components/marketing/showcase/booking";
import { ColorEditorCard } from "@/components/marketing/showcase/color-editor";
import { CookiePreferences } from "@/components/marketing/showcase/cookie-preferences";
import { Faq } from "@/components/marketing/showcase/faq";
import { Filters } from "@/components/marketing/showcase/filters";
import { InviteMembers } from "@/components/marketing/showcase/invite-members";
import { LoginForm } from "@/components/marketing/showcase/login-form";
import { Notifications } from "@/components/marketing/showcase/notifications";
import { Payment } from "@/components/marketing/showcase/payment";
import { Shortcuts } from "@/components/marketing/showcase/shortcuts";
import { SkeletonRail } from "@/components/marketing/showcase/skeleton-cards";
import { Storage } from "@/components/marketing/showcase/storage";
import { TeamName } from "@/components/marketing/showcase/team-name";
import { TwoFactor } from "@/components/marketing/showcase/two-factor";
import { UploadAvatar } from "@/components/marketing/showcase/upload-avatar";

// The real showcase cards, centered. On large screens it's capped at `--grid-max`
// and centered, with the extra space going to the skeleton rails beside it. Below
// `lg` there are no rails: the grid is deliberately wider than the viewport (a
// 3-column masonry, `max(52rem, 120vw)`) and centered, so the middle column reads
// normally while the outer two — the columns "removed" from the large 4-col grid —
// bleed off both edges and get darkened by the overlay in `Cards`.
function RealCards() {
	return (
		<div className="relative z-20 w-[max(52rem,120vw)] max-w-none shrink-0 columns-3 gap-4 *:mb-4 *:break-inside-avoid lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink xl:columns-4">
			<Booking />
			<TwoFactor />
			<Filters />
			<Storage />
			<Notifications className="h-100" />
			<CookiePreferences />
			<InviteMembers />
			<Shortcuts />
			<Payment />
			<Agents />
			<AccountMenu />
			<Faq />
			<ColorEditorCard />
			<UploadAvatar />
			<TeamName />
			<AskAi />
			<LoginForm className="max-w-none" />
		</div>
	);
}

export function Cards() {
	return (
		// Flex row: [left rail | gap | capped real grid | gap | right rail]. The rails
		// grow to fill whatever horizontal space the centered, max-width grid leaves
		// (a thin peek on small screens, wide rails on large ones). The `gap-4` between
		// the grid and rails matches the gap between cards. The bottom is masked so the
		// whole showcase — real cards and skeletons alike — fades into the next section.
		<div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_520px),transparent_calc(100%_-_180px))] [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
			<SkeletonRail side="left" />
			<RealCards />
			<SkeletonRail side="right" />
			{/* Below `lg` (no rails) the real grid bleeds off both edges; this overlay
			    fades those bleeding columns into the page background so they read as
			    dark edges rather than abruptly-clipped cards. Hidden on `lg`+, where the
			    rails handle their own fade. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-30 [background:linear-gradient(to_right,var(--color-bg),transparent_18%,transparent_82%,var(--color-bg))] lg:hidden"
			/>
		</div>
	);
}

export default Cards;
