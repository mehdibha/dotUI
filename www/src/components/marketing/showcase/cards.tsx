import { AccountMenu } from "@/components/marketing/showcase/account-menu";
import { AskAi } from "@/components/marketing/showcase/ask-ai";
import { Booking } from "@/components/marketing/showcase/booking";
import { ColorEditorCard } from "@/components/marketing/showcase/color-editor";
import { ComputerUse } from "@/components/marketing/showcase/computer-use";
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

// One masonry cell. The vertical gap between cards is the cell's *padding*-bottom,
// never a margin: in a CSS multi-column layout WebKit/Safari leaks a child's
// `margin-bottom` onto the top of the *next* column, so a `*:mb-4` on the grid
// pushes whichever card lands at the top of a balanced column down by 16px — only
// in Safari (Chromium aligns them). Padding stays inside the cell's box at the
// column break, so every column's first card starts flush at the top everywhere.
// `break-inside-avoid` keeps each card whole instead of splitting across columns.
function Cell({ children }: { children: React.ReactNode }) {
	return <div className="break-inside-avoid pb-4">{children}</div>;
}

// The real showcase cards, centered. On large screens it's capped at `--grid-max`
// and centered, with the extra space going to the skeleton rails beside it. Below
// `lg` there are no rails: the grid is deliberately wider than the viewport (a
// 3-column masonry, `max(52rem, 120vw)`) and centered, so the middle column reads
// normally while the outer two — the columns "removed" from the large 4-col grid —
// bleed off both edges and get darkened by the overlay in `Cards`.
function RealCards() {
	return (
		<div className="relative z-20 w-[max(52rem,120vw)] max-w-none shrink-0 columns-3 gap-4 lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink xl:columns-4">
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
	);
}

export function Cards() {
	return (
		// Flex row: [left rail | gap | capped real grid | gap | right rail]. The rails
		// grow to fill whatever horizontal space the centered, max-width grid leaves
		// (a thin peek on small screens, wide rails on large ones). The `gap-4` between
		// the grid and rails matches the gap between cards. The bottom is masked so the
		// whole showcase — real cards and skeletons alike — fades into the next section.
		// The fade has to swallow the ragged column bottoms, whose spread tracks the
		// column count: the 3-column layout (everything below `xl`) is much taller and
		// raggier, so it needs a deeper, taller fade than the shorter 4-column `xl` grid
		// — hence the `--mask-*` distances-from-bottom shrink at `xl`. `--mask-solid` is
		// where content is still fully opaque; `--mask-clear` where it's fully gone.
		// `--mask-clear` is deliberately set *above* where the next section's "Built on
		// modern tools" row is pulled up to (its `-mt-*` in `index.tsx`), so that row sits
		// on solid-dark background — no faint card fragments behind it — and the cards only
		// start fading back in above it.
		<div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] [--grid-max:1500px] [--mask-clear:420px] [--mask-solid:980px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem] xl:[--mask-clear:370px] xl:[--mask-solid:880px]">
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
