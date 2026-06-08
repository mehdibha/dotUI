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
import { Storage } from "@/components/marketing/showcase/storage";
import { TeamName } from "@/components/marketing/showcase/team-name";
import { TwoFactor } from "@/components/marketing/showcase/two-factor";
import { UploadAvatar } from "@/components/marketing/showcase/upload-avatar";
import { cn } from "@/registry/lib/utils";

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

// The masonry grid of showcase cards — the single source of truth for which cards
// render and in what order. Shared by the landing page (`cards.tsx` wraps it with
// the skeleton rails and edge fade) and the /create preview's "Showcase" view, so
// both render the exact same cards. Only the column count and width vary by
// context: they come from `className`, which `cn` merges over the defaults below
// (the landing's 3-up, 4-up-at-xl masonry). The cells, gap, and card order stay
// identical everywhere.
export function CardsGrid({ className }: { className?: string }) {
	return (
		<div className={cn("columns-3 gap-4 xl:columns-4", className)}>
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
