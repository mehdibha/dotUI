import { AccountMenu } from "@/components/marketing/showcase/account-menu";
import { Booking } from "@/components/marketing/showcase/booking";
import { ColorEditorCard } from "@/components/marketing/showcase/color-editor";
import { CookiePreferences } from "@/components/marketing/showcase/cookie-preferences";
import { Faq } from "@/components/marketing/showcase/faq";
import { Feedback } from "@/components/marketing/showcase/feedback";
import { Filters } from "@/components/marketing/showcase/filters";
import { InviteMembers } from "@/components/marketing/showcase/invite-members";
import { LoginForm } from "@/components/marketing/showcase/login-form";
import { Notifications } from "@/components/marketing/showcase/notifications";
import { Payment } from "@/components/marketing/showcase/payment";
import { Shortcuts } from "@/components/marketing/showcase/shortcuts";
import { SkeletonRail } from "@/components/marketing/showcase/skeleton-cards";
import { Storage } from "@/components/marketing/showcase/storage";
import { TeamName } from "@/components/marketing/showcase/team-name";
import { Transactions } from "@/components/marketing/showcase/transactions";
import { TwoFactor } from "@/components/marketing/showcase/two-factor";
import { UploadAvatar } from "@/components/marketing/showcase/upload-avatar";

// The real showcase cards, centered. Capped at `--grid-max` so the cards stop
// growing on wide screens (the extra space goes to the skeleton rails beside
// it). The masonry reflows 1 → 2 → 3 → 4 columns as the viewport widens.
function RealCards() {
	return (
		<div className="relative z-20 w-full max-w-(--grid-max) min-w-0 shrink columns-1 gap-4 *:mb-4 *:break-inside-avoid sm:columns-2 lg:columns-3 xl:columns-4">
			<Booking />
			<TwoFactor />
			<Filters />
			<Storage />
			<Notifications className="h-100" />
			<CookiePreferences />
			<InviteMembers />
			<Shortcuts />
			<Payment />
			<Transactions />
			<AccountMenu />
			<Faq />
			<ColorEditorCard />
			<UploadAvatar />
			<TeamName />
			<Feedback />
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
		<div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_100px),transparent_calc(100%_-_50px))] [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
			<SkeletonRail side="left" />
			<RealCards />
			<SkeletonRail side="right" />
		</div>
	);
}

export default Cards;
